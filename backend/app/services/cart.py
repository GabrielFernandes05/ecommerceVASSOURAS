from typing import Optional

from sqlalchemy.orm import Session

from app.models.cart import Cart, CartItem
from app.repositories.cart import cart_item_repository, cart_repository
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse


class CartService:
    def get_user_cart(self, db: Session, user_id: int) -> CartResponse:
        cart = cart_repository.get_or_create_cart(db, user_id=user_id)
        total = cart_repository.calculate_cart_total(db, cart_id=cart.id)

        return CartResponse(id=cart.id, items=cart.items, total=total)

    def add_item_to_cart(
        self, db: Session, *, user_id: int, product_id: int, quantity: int = 1
    ) -> CartItem:
        cart = cart_repository.get_or_create_cart(db, user_id=user_id)
        return cart_item_repository.add_item_to_cart(
            db, cart_id=cart.id, product_id=product_id, quantity=quantity
        )

    def update_cart_item(
        self, db: Session, *, user_id: int, item_id: int, obj_in: CartItemUpdate
    ) -> Optional[CartItem]:
        cart = cart_repository.get_cart_by_user(db, user_id=user_id)
        if not cart:
            return None

        item = (
            db.query(CartItem)
            .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
            .first()
        )

        if not item:
            return None

        return cart_item_repository.update(db, db_obj=item, obj_in=obj_in)

    def remove_cart_item(
        self, db: Session, *, user_id: int, item_id: int
    ) -> Optional[CartItem]:
        cart = cart_repository.get_cart_by_user(db, user_id=user_id)
        if not cart:
            return None

        item = (
            db.query(CartItem)
            .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
            .first()
        )

        if not item:
            return None

        db.delete(item)
        db.commit()
        return item

    def clear_cart(self, db: Session, *, user_id: int) -> None:
        cart = cart_repository.get_cart_by_user(db, user_id=user_id)
        if not cart:
            return

        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()


cart_service = CartService()
