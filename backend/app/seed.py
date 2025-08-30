from .database import engine, SessionLocal, Base
from . import models, auth

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Categories
    cat_names = ["Elektronik", "Fashion", "Rumah Tangga"]
    cats = []
    for name in cat_names:
        c = db.query(models.Category).filter_by(name=name).first()
        if not c:
            c = models.Category(name=name)
            db.add(c)
            db.flush()
        cats.append(c)
    # Products
    products = [
        ("Headphone Bluetooth", "Suara jernih, baterai 30 jam.", 299000, "https://picsum.photos/seed/1/600/400", 50, cats[0].id),
        ("Smartwatch Basic", "Monitoring langkah & detak jantung.", 499000, "https://picsum.photos/seed/2/600/400", 35, cats[0].id),
        ("Kemeja Pria Slim Fit", "Bahan adem, nyaman dipakai.", 159000, "https://picsum.photos/seed/3/600/400", 120, cats[1].id),
        ("Gaun Kasual", "Ringan dan stylish untuk harian.", 199000, "https://picsum.photos/seed/4/600/400", 70, cats[1].id),
        ("Set Pisau Dapur", "Stainless steel, tajam dan awet.", 129000, "https://picsum.photos/seed/5/600/400", 80, cats[2].id),
    ]
    for name, desc, price, img, stock, cid in products:
        exists = db.query(models.Product).filter_by(name=name).first()
        if not exists:
            p = models.Product(name=name, description=desc, price=price, image_url=img, stock=stock, category_id=cid)
            db.add(p)
    # Demo user
    if not db.query(models.User).filter_by(email="demo@local.test").first():
        db.add(models.User(email="demo@local.test", password_hash=auth.hash_password("password123"), name="Demo User"))
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
