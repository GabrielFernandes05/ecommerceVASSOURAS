from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.product import product_repository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def get(self, db: Session, product_id: int) -> Optional[Product]:
        return product_repository.get(db, id=product_id)

    def get_by_name(self, db: Session, name: str) -> Optional[Product]:
        return product_repository.get_by_name(db, name=name)

    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
    ) -> List[Product]:
        return product_repository.get_multi_with_filter(
            db, skip=skip, limit=limit, category_id=category_id, search=search
        )

    def count(
        self,
        db: Session,
        *,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
    ) -> int:
        return product_repository.count_with_filter(
            db, category_id=category_id, search=search
        )

    def create(self, db: Session, *, obj_in: ProductCreate) -> Product:
        category_ids = obj_in.category_ids
        product_data = obj_in.model_dump(exclude={"category_ids"})
        product_create = ProductCreate(**product_data)
        return product_repository.create_with_categories(
            db, obj_in=product_create, category_ids=category_ids
        )

    def create_by_user(self, db: Session, obj_in: ProductCreate, user_id: int):
        data = obj_in.dict(exclude_unset=True)
        category_ids = data.pop("category_ids", [])
        db_obj = Product(**data, created_by_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        if category_ids:
            db_obj.categories = (
                db.query(Category).filter(Category.id.in_(category_ids)).all()
            )
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Product, obj_in: ProductUpdate) -> Product:
        category_ids = None
        if hasattr(obj_in, "category_ids") and obj_in.category_ids is not None:
            category_ids = obj_in.category_ids
            obj_in_data = obj_in.model_dump(exclude={"category_ids"})
            obj_in = ProductUpdate(**obj_in_data)

        return product_repository.update_with_categories(
            db, db_obj=db_obj, obj_in=obj_in, category_ids=category_ids
        )

    def remove(self, db: Session, *, product_id: int) -> Product:
        return product_repository.remove(db, id=product_id)


product_service = ProductService()
