from typing import List, Optional, Tuple

from sqlalchemy.orm import Session, joinedload

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.repositories.base import BaseRepository
from app.schemas.order import OrderCreate


class OrderRepository(BaseRepository[Order, OrderCreate, OrderCreate]):
    def get_orders_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        return (
            db.query(Order)
            .filter(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_orders_by_user(self, db: Session, *, user_id: int) -> int:
        return db.query(Order).filter(Order.user_id == user_id).count()

    def get_order_with_items(
        self, db: Session, *, order_id: int, user_id: Optional[int] = None
    ) -> Optional[Order]:
        query = db.query(Order).filter(Order.id == order_id)

        if user_id:
            query = query.filter(Order.user_id == user_id)

        return query.options(joinedload(Order.items)).first()

    def create_order_with_items(
        self,
        db: Session,
        *,
        user_id: int,
        shipping_address: str,
        payment_method: str,
        items: List[Tuple[int, int]],  # List of (product_id, quantity)
    ) -> Order:
        # Verify product prices and calculate total
        total_amount = 0.0
        order_items = []

        for product_id, quantity in items:
            product = db.query(Product).filter(Product.id == product_id).first()
            if not product:
                continue

            total_amount += product.price * quantity
            order_items.append(
                OrderItem(
                    product_id=product_id, quantity=quantity, unit_price=product.price
                )
            )

        # Create order
        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=shipping_address,
            payment_method=payment_method,
            status="pending",
        )

        db.add(order)
        db.flush()

        # Add items to order
        for item in order_items:
            item.order_id = order.id
            db.add(item)

        db.commit()
        db.refresh(order)
        return order


order_repository = OrderRepository(Order)
