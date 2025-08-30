from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, asc, desc
from typing import Optional, Literal

from .database import get_db
from . import models, schemas, auth

router = APIRouter(prefix="/api")


# -------------------- AUTH --------------------
@router.post("/auth/register", response_model=schemas.TokenOut)
def register(payload: schemas.RegisterIn, db: Session = Depends(get_db)):
    exists = db.query(models.User).filter(models.User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = models.User(
        email=payload.email,
        password_hash=auth.hash_password(payload.password),
        name=payload.name,
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal menyimpan user")

    token = auth.create_token(user.id)
    return {"token": token}


@router.post("/auth/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = auth.create_token(user.id)
    return {"token": token}


# -------------------- PRODUCTS --------------------
@router.get("/products", response_model=schemas.ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category_id: Optional[int] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    sort: Optional[Literal["price_asc", "price_desc"]] = None,
    q: Optional[str] = None,
):
    query = db.query(models.Product).join(models.Category, isouter=True)

    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if price_min is not None:
        query = query.filter(models.Product.price >= price_min)
    if price_max is not None:
        query = query.filter(models.Product.price <= price_max)
    if q:
        like = f"%{q}%"
        query = query.filter(models.Product.name.ilike(like))

    total = query.with_entities(func.count(models.Product.id)).scalar()

    if sort == "price_asc":
        query = query.order_by(asc(models.Product.price))
    elif sort == "price_desc":
        query = query.order_by(desc(models.Product.price))
    else:
        query = query.order_by(models.Product.id.desc())

    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {"items": items, "page": page, "page_size": page_size, "total": total}


@router.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    return p


# -------------------- CATEGORIES --------------------
@router.get("/categories", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(models.Category).order_by(models.Category.name).all()
    return cats


# -------------------- ORDERS --------------------
@router.post("/orders", response_model=schemas.OrderOut)
def create_order(
    payload: schemas.CheckoutIn,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user),
):
    if not user and not payload.guest_email:
        raise HTTPException(
            status_code=422,
            detail="guest_email wajib untuk checkout sebagai guest"
        )

    # Validasi produk & stok
    product_ids = [i.product_id for i in payload.items]
    product_map = {
        p.id: p for p in db.query(models.Product).filter(models.Product.id.in_(product_ids)).all()
    }
    if len(product_map) != len(payload.items):
        raise HTTPException(status_code=400, detail="Produk tidak ditemukan")

    total = 0
    for item in payload.items:
        product = product_map[item.product_id]
        if item.quantity <= 0:
            raise HTTPException(status_code=422, detail="Jumlah produk harus > 0")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stok tidak cukup untuk {product.name}"
            )
        total += float(product.price) * item.quantity

    try:
        order = models.Order(
            user_id=user.id if user else None,
            guest_email=None if user else payload.guest_email,
            shipping_address=payload.shipping_address,
            total_amount=total,
        )
        db.add(order)
        db.flush()

        for item in payload.items:
            product = product_map[item.product_id]
            db.add(models.OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            ))
            product.stock -= item.quantity

        db.commit()
        db.refresh(order)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal membuat order")

    return schemas.OrderOut(
        id=order.id,
        user_id=order.user_id,
        guest_email=order.guest_email,
        shipping_address=order.shipping_address,
        total_amount=float(order.total_amount),
        items=[
            schemas.OrderItemOut(
                product_id=it.product_id,
                name=product_map[it.product_id].name,
                quantity=it.quantity,
                price=float(it.price)
            )
            for it in order.items
        ],
    )


@router.get("/orders", response_model=list[schemas.OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user),
    email: Optional[str] = None,
):
    if user:
        orders = (
            db.query(models.Order)
            .options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
            .filter(models.Order.user_id == user.id)
            .order_by(models.Order.id.desc())
            .all()
        )
    else:
        if not email:
            raise HTTPException(status_code=401, detail="Wajib login atau sertakan email guest")
        orders = (
            db.query(models.Order)
            .options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
            .filter(models.Order.guest_email == email)
            .order_by(models.Order.id.desc())
            .all()
        )

    return [
        schemas.OrderOut(
            id=o.id,
            user_id=o.user_id,
            guest_email=o.guest_email,
            shipping_address=o.shipping_address,
            total_amount=float(o.total_amount),
            items=[
                schemas.OrderItemOut(
                    product_id=it.product_id,
                    name=it.product.name,
                    quantity=it.quantity,
                    price=float(it.price),
                )
                for it in o.items
            ],
        )
        for o in orders
    ]
