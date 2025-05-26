from typing import List, Optional

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: Optional[str] = None


class CategoryInDBBase(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class Category(CategoryInDBBase):
    pass


class CategoryWithProducts(CategoryInDBBase):
    products: List["ProductInDB"] = []


from app.schemas.product import ProductInDBBase as ProductInDB
CategoryWithProducts.model_rebuild()