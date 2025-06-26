from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    id: int
    name: str


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    image_url: Optional[str] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    category_ids: List[int] = []


class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_ids: Optional[List[int]] = None


class ProductInDBBase(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    categories: List[CategoryBase] = []
    created_by_id: int

    class Config:
        from_attributes = True


class Product(ProductInDBBase):
    pass


class ProductDetail(Product):
    pass