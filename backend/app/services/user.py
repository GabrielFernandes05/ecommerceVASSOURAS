from typing import Optional

from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.user import User
from app.repositories.user import user_repository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def get(self, db: Session, user_id: int) -> Optional[User]:
        return user_repository.get(db, id=user_id)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return user_repository.get_by_email(db, email=email)

    def create(self, db: Session, obj_in: UserCreate) -> User:
        user = user_repository.create(db, obj_in=obj_in)
        self._create_user_cart(db, user)
        return user

    def _create_user_cart(self, db: Session, user: User) -> None:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()

    def update(self, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        return user_repository.update(db, db_obj=db_obj, obj_in=obj_in)

    def authenticate(self, db: Session, email: str, password: str) -> Optional[User]:
        return user_repository.authenticate(db, email=email, password=password)

    def is_active(self, user: User) -> bool:
        return user_repository.is_active(user)

    def is_superuser(self, user: User) -> bool:
        return user_repository.is_superuser(user)


user_service = UserService()
