from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class ProductInCart(BaseModel):
    id: int
    name: str
    price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class CartItemInDBBase(CartItemBase):
    id: int
    cart_id: int

    class Config:
        from_attributes = True


class CartItem(CartItemInDBBase):
    pass


class CartItemResponse(CartItemBase):
    id: int
    product: ProductInCart

    class Config:
        from_attributes = True


class CartBase(BaseModel):
    user_id: int


class CartCreate(CartBase):
    pass


class CartInDBBase(CartBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Cart(CartInDBBase):
    pass


class CartResponse(BaseModel):
    id: int
    items: List[CartItemResponse] = []
    total: float = 0

    class Config:
        from_attributes = True