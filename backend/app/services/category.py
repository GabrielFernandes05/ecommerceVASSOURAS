from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.category import Category
from app.repositories.category import category_repository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def get(self, db: Session, category_id: int) -> Optional[Category]:
        return category_repository.get(db, id=category_id)

    def get_by_name(self, db: Session, name: str) -> Optional[Category]:
        return category_repository.get_by_name(db, name=name)

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Category]:
        return category_repository.get_multi(db, skip=skip, limit=limit)

    def get_multi_with_products(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Category]:
        return category_repository.get_multi_with_products(db, skip=skip, limit=limit)

    def create(self, db: Session, *, obj_in: CategoryCreate) -> Category:
        return category_repository.create(db, obj_in=obj_in)

    def update(
        self, db: Session, *, db_obj: Category, obj_in: CategoryUpdate
    ) -> Category:
        return category_repository.update(db, db_obj=db_obj, obj_in=obj_in)

    def remove(self, db: Session, *, category_id: int) -> Category:
        return category_repository.remove(db, id=category_id)


category_service = CategoryService()
