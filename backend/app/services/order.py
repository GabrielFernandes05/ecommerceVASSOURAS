from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from app.models.order import Order
from app.repositories.order import order_repository
from app.schemas.order import OrderCreate, OrderList, OrderResponse, OrderSummary


class OrderService:
    def get(
        self, db: Session, order_id: int, user_id: Optional[int] = None
    ) -> Optional[Order]:
        return order_repository.get_order_with_items(
            db, order_id=order_id, user_id=user_id
        )

    def get_user_orders(
        self, db: Session, user_id: int, skip: int = 0, limit: int = 100
    ) -> OrderList:
        orders = order_repository.get_orders_by_user(
            db, user_id=user_id, skip=skip, limit=limit
        )
        total = order_repository.count_orders_by_user(db, user_id=user_id)

        order_summaries = [
            OrderSummary(
                id=order.id,
                total_amount=order.total_amount,
                status=order.status,
                created_at=order.created_at,
            )
            for order in orders
        ]

        return OrderList(items=order_summaries, total=total)

    def create_from_cart(
        self,
        db: Session,
        *,
        user_id: int,
        shipping_address: str,
        payment_method: str,
        cart_items: List[Tuple[int, int]],  # List of (product_id, quantity)
    ) -> Order:
        order = order_repository.create_order_with_items(
            db,
            user_id=user_id,
            shipping_address=shipping_address,
            payment_method=payment_method,
            items=cart_items,
        )
        return order

    def update_order_status(
        self, db: Session, *, order_id: int, status: str
    ) -> Optional[Order]:
        order = order_repository.get(db, id=order_id)
        if not order:
            return None

        order.status = status
        db.add(order)
        db.commit()
        db.refresh(order)
        return order


order_service = OrderService()
