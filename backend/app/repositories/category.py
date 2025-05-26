from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.category import Category
from app.repositories.base import BaseRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryRepository(BaseRepository[Category, CategoryCreate, CategoryUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Category]:
        return db.query(Category).filter(Category.name == name).first()

    def get_multi_with_products(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Category]:
        return db.query(Category).offset(skip).limit(limit).all()


category_repository = CategoryRepository(Category)
