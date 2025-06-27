from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.repositories.base import BaseRepository
from app.schemas.cart import CartCreate, CartItemCreate, CartItemUpdate


class CartStockError(Exception):
    """Exceção customizada para erros de estoque"""

    def __init__(self, message: str, available_stock: int = 0):
        self.message = message
        self.available_stock = available_stock
        super().__init__(self.message)


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
        # Verificar se o produto existe e tem estoque suficiente
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise CartStockError("Produto não encontrado")
        if not product.is_active:
            raise CartStockError("Produto não está ativo")

        cart_item = self.get_by_product(db, cart_id=cart_id, product_id=product_id)

        if cart_item:
            # Verificar se a nova quantidade total não excede o estoque
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                raise CartStockError(
                    f"Estoque insuficiente. Disponível: {product.stock}, no carrinho: {cart_item.quantity}",
                    available_stock=product.stock,
                )
            cart_item.quantity = new_quantity
            db.add(cart_item)
            db.commit()
            db.refresh(cart_item)
            return cart_item

        # Para novo item, verificar se a quantidade não excede o estoque
        if quantity > product.stock:
            raise CartStockError(
                f"Estoque insuficiente. Disponível: {product.stock}",
                available_stock=product.stock,
            )

        cart_item = CartItem(cart_id=cart_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item

    def update_cart_item_quantity(
        self, db: Session, *, cart_item: CartItem, new_quantity: int
    ) -> CartItem:
        # Verificar se o produto tem estoque suficiente
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if not product:
            raise CartStockError("Produto não encontrado")

        if new_quantity > product.stock:
            raise CartStockError(
                f"Estoque insuficiente. Disponível: {product.stock}",
                available_stock=product.stock,
            )

        cart_item.quantity = new_quantity
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item


cart_repository = CartRepository(Cart)
cart_item_repository = CartItemRepository(CartItem)
