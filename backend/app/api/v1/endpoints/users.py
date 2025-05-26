from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_active_superuser, get_db
from app.models.user import User
from app.schemas.user import User as UserSchema
from app.schemas.user import UserCreate, UserUpdate
from app.services.user import user_service

router = APIRouter()


@router.post("/register", response_model=UserSchema)
def create_user(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    user = user_service.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400, detail="A user with this email already exists."
        )
    user = user_service.create(db, obj_in=user_in)
    return user


@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    return current_user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    user = user_service.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=UserSchema)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db),
) -> Any:
    user = user_service.get(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
