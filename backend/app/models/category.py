from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base
from app.models.product import category_product


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)

    products = relationship("Product", secondary=category_product, back_populates="categories")