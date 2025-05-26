from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.product import Product, category_product
from app.repositories.base import BaseRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductRepository(BaseRepository[Product, ProductCreate, ProductUpdate]):
    def create_with_categories(
        self, db: Session, *, obj_in: ProductCreate, category_ids: List[int]
    ) -> Product:
        product = self.create(db, obj_in=obj_in)
        self._set_product_categories(db, product=product, category_ids=category_ids)
        return product

    def update_with_categories(
        self,
        db: Session,
        *,
        db_obj: Product,
        obj_in: ProductUpdate,
        category_ids: Optional[List[int]] = None,
    ) -> Product:
        product = self.update(db, db_obj=db_obj, obj_in=obj_in)
        if category_ids is not None:
            self._set_product_categories(db, product=product, category_ids=category_ids)
        return product

    def _set_product_categories(
        self, db: Session, *, product: Product, category_ids: List[int]
    ) -> None:
        db.execute(
            category_product.delete().where(category_product.c.product_id == product.id)
        )
        for category_id in category_ids:
            db.execute(
                category_product.insert().values(
                    product_id=product.id, category_id=category_id
                )
            )
        db.commit()

    def get_by_name(self, db: Session, *, name: str) -> Optional[Product]:
        return db.query(Product).filter(Product.name == name).first()

    def get_multi_with_filter(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        is_active: bool = True,
    ) -> List[Product]:
        query = db.query(Product).filter(Product.is_active == is_active)

        if category_id:
            query = query.join(category_product).filter(
                category_product.c.category_id == category_id
            )

        if search:
            search_term = f"%{search}%"
            query = query.filter(Product.name.ilike(search_term))

        return query.offset(skip).limit(limit).all()

    def count_with_filter(
        self,
        db: Session,
        *,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        is_active: bool = True,
    ) -> int:
        query = db.query(Product).filter(Product.is_active == is_active)

        if category_id:
            query = query.join(category_product).filter(
                category_product.c.category_id == category_id
            )

        if search:
            search_term = f"%{search}%"
            query = query.filter(Product.name.ilike(search_term))

        return query.count()


product_repository = ProductRepository(Product)
