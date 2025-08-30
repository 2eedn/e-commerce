from pydantic import BaseModel, Field, EmailStr, conint, conlist, field_validator
from typing import Optional, List

# -------------------------
# CATEGORY & PRODUCT SCHEMAS
# -------------------------
class CategoryOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    stock: int
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductOut]
    page: int
    page_size: int
    total: int

# -------------------------
# AUTH SCHEMAS
# -------------------------
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    token: str
    token_type: str = "bearer"

# -------------------------
# CHECKOUT & ORDER SCHEMAS
# -------------------------
class CheckoutItem(BaseModel):
    product_id: int
    quantity: conint(gt=0)


class CheckoutIn(BaseModel):
    guest_email: Optional[EmailStr] = None
    shipping_address: str = Field(..., min_length=5)
    items: conlist(CheckoutItem, min_length=1)

    @field_validator("guest_email")
    @classmethod
    def at_least_guest_email_or_user(cls, v):
        # Validasi tambahan: minimal ada guest_email ATAU user login
        # (logikanya dilanjutkan di endpoint)
        return v


class OrderItemOut(BaseModel):
    product_id: int
    name: str
    quantity: int
    price: float


class OrderOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    guest_email: Optional[EmailStr] = None
    shipping_address: str
    total_amount: float
    items: List[OrderItemOut]

    class Config:
        from_attributes = True
