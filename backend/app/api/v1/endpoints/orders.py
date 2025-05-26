from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_superuser, get_current_user, get_db
from app.models.cart import CartItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderList, OrderResponse
from app.services.cart import cart_service
from app.services.order import order_service

router = APIRouter()


@router.get("/", response_model=OrderList)
def read_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
) -> Any:
    orders = order_service.get_user_orders(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    order = order_service.get(db, order_id=order_id, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=OrderResponse)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    cart = cart_service.get_user_cart(db, user_id=current_user.id)
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    cart_items = [(item.product_id, item.quantity) for item in cart.items]

    order = order_service.create_from_cart(
        db,
        user_id=current_user.id,
        shipping_address=order_in.shipping_address,
        payment_method=order_in.payment_method,
        cart_items=cart_items,
    )

    cart_service.clear_cart(db, user_id=current_user.id)

    return order


@router.put(
    "/{order_id}/status",
    response_model=OrderResponse,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_order_status(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    status: str,
) -> Any:
    order = order_service.update_order_status(db, order_id=order_id, status=status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
