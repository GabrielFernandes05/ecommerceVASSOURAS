from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.cart import CartItem
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    CartResponse,
)
from app.services.cart import cart_service

router = APIRouter()


@router.get("/", response_model=CartResponse)
def read_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    return cart_service.get_user_cart(db, user_id=current_user.id)


@router.post("/items", response_model=CartItemResponse)
def add_item_to_cart(
    *,
    db: Session = Depends(get_db),
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    cart_item = cart_service.add_item_to_cart(
        db,
        user_id=current_user.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity,
    )
    return cart_item


@router.put("/items/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    *,
    db: Session = Depends(get_db),
    item_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    cart_item = cart_service.update_cart_item(
        db, user_id=current_user.id, item_id=item_id, obj_in=item_in
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart_item


@router.delete("/items/{item_id}", response_model=CartItemResponse)
def remove_cart_item(
    *,
    db: Session = Depends(get_db),
    item_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    cart_item = cart_service.remove_cart_item(
        db, user_id=current_user.id, item_id=item_id
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart_item


@router.delete("/", response_model=dict)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    cart_service.clear_cart(db, user_id=current_user.id)
    return {"message": "Cart cleared successfully"}
