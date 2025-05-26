from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)
    unit_price: float = Field(gt=0)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderItem(OrderItemInDBBase):
    pass


class OrderItemResponse(BaseModel):
    product_name: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str


class OrderCreate(OrderBase):
    pass


class OrderInDBBase(OrderBase):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Order(OrderInDBBase):
    pass


class OrderResponse(OrderInDBBase):
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderSummary(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class OrderList(BaseModel):
    items: List[OrderSummary]
    total: int

    class Config:
        from_attributes = True
