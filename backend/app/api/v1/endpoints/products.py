from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_superuser, get_db
from app.models.user import User
from app.schemas.product import Product, ProductCreate, ProductDetail, ProductUpdate
from app.services.product import product_service

router = APIRouter()


@router.get("/", response_model=dict)
def read_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    category: Optional[int] = None,
    search: Optional[str] = None,
) -> Any:
    products = product_service.get_multi(
        db, skip=skip, limit=limit, category_id=category, search=search
    )
    total = product_service.count(db, category_id=category, search=search)
    return {
        "items": products,
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 1,
    }


@router.get("/{product_id}", response_model=ProductDetail)
def read_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
) -> Any:
    product = product_service.get(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post(
    "/", response_model=Product, dependencies=[Depends(get_current_active_superuser)]
)
def create_product(
    *,
    db: Session = Depends(get_db),
    product_in: ProductCreate,
) -> Any:
    product = product_service.create(db, obj_in=product_in)
    return product


@router.put(
    "/{product_id}",
    response_model=Product,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    product_in: ProductUpdate,
) -> Any:
    product = product_service.get(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = product_service.update(db, db_obj=product, obj_in=product_in)
    return product


@router.delete(
    "/{product_id}",
    response_model=Product,
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
) -> Any:
    product = product_service.get(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = product_service.remove(db, product_id=product_id)
    return product
