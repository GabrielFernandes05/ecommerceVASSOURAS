from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_superuser, get_db
from app.models.user import User
from app.schemas.category import Category, CategoryCreate, CategoryUpdate
from app.services.category import category_service

router = APIRouter()


@router.get("/", response_model=List[Category])
def read_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    categories = category_service.get_multi(db, skip=skip, limit=limit)
    return categories


@router.get("/{category_id}", response_model=Category)
def read_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> Any:
    category = category_service.get(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post(
    "/", response_model=Category, dependencies=[Depends(get_current_active_superuser)]
)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
) -> Any:
    category = category_service.get_by_name(db, name=category_in.name)
    if category:
        raise HTTPException(
            status_code=400,
            detail=f"Category with name '{category_in.name}' already exists",
        )
    category = category_service.create(db, obj_in=category_in)
    return category


@router.put(
    "/{category_id}",
    response_model=Category,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    category_in: CategoryUpdate,
) -> Any:
    category = category_service.get(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = category_service.update(db, db_obj=category, obj_in=category_in)
    return category


@router.delete(
    "/{category_id}",
    response_model=Category,
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> Any:
    category = category_service.get(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = category_service.remove(db, category_id=category_id)
    return category
