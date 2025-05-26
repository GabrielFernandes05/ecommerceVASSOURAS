from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.repositories.base import BaseRepository
from app.schemas.cart import CartCreate, CartItemCreate, CartItemUpdate


class CartRepository(BaseRepository[Cart, CartCreate, CartCreate]):
    def get_cart_by_user(self, db: Session, *, user_id: int) -> Optional[Cart]:
        return (
            db.query(Cart)
            .filter(Cart.user_id == user_id)
            .options(joinedload(Cart.items).joinedload(CartItem.product))
            .first()
        )

    def create_cart_for_user(self, db: Session, *, user_id: int) -> Cart:
        db_obj = Cart(user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_or_create_cart(self, db: Session, *, user_id: int) -> Cart:
        cart = self.get_cart_by_user(db, user_id=user_id)
        if not cart:
            cart = self.create_cart_for_user(db, user_id=user_id)
        return cart

    def calculate_cart_total(self, db: Session, *, cart_id: int) -> float:
        items = (
            db.query(CartItem, Product.price)
            .join(Product)
            .filter(CartItem.cart_id == cart_id)
            .all()
        )
        return sum(item[0].quantity * item[1] for item in items)


class CartItemRepository(BaseRepository[CartItem, CartItemCreate, CartItemUpdate]):
    def get_by_product(
        self, db: Session, *, cart_id: int, product_id: int
    ) -> Optional[CartItem]:
        return (
            db.query(CartItem)
            .filter(CartItem.cart_id == cart_id, CartItem.product_id == product_id)
            .first()
        )

    def add_item_to_cart(
        self, db: Session, *, cart_id: int, product_id: int, quantity: int = 1
    ) -> CartItem:
        cart_item = self.get_by_product(db, cart_id=cart_id, product_id=product_id)

        if cart_item:
            cart_item.quantity += quantity
            db.add(cart_item)
            db.commit()
            db.refresh(cart_item)
            return cart_item

        cart_item = CartItem(cart_id=cart_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item


cart_repository = CartRepository(Cart)
cart_item_repository = CartItemRepository(CartItem)
