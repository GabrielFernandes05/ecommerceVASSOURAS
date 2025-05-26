import sys
import os
from pathlib import Path

# Adicionar o diretório raiz ao PYTHONPATH
root_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(root_dir))

# Importar db.base que contém todas as referências aos modelos
from app.db.base import Base
from app.db.session import SessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.core.security import get_password_hash


def seed_data():
    db = SessionLocal()

    try:
        # Verificar se já existem dados
        if db.query(User).count() > 0:
            print("Dados já existem no banco. Pulando seed.")
            return

        # Criar usuário admin
        admin_user = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            name="Admin User",
            address="Admin Address",
            is_superuser=True,
        )
        db.add(admin_user)

        # Criar usuário normal
        normal_user = User(
            email="user@example.com",
            hashed_password=get_password_hash("user123"),
            name="Normal User",
            address="User Address",
        )
        db.add(normal_user)

        # Criar categorias
        categories = [
            Category(name="Eletrônicos", description="Dispositivos eletrônicos"),
            Category(name="Roupas", description="Vestimentas diversas"),
            Category(name="Livros", description="Livros físicos e e-books"),
            Category(name="Casa e Decoração", description="Itens para casa"),
        ]

        for category in categories:
            db.add(category)

        db.commit()

        # Criar produtos
        products = [
            Product(
                name="Smartphone XYZ",
                description="Smartphone de última geração",
                price=999.99,
                stock=50,
                image_url="https://example.com/smartphone.jpg",
            ),
            Product(
                name="Notebook ABC",
                description="Notebook poderoso para trabalho",
                price=1999.99,
                stock=20,
                image_url="https://example.com/notebook.jpg",
            ),
            Product(
                name="Camiseta Casual",
                description="Camiseta confortável para uso diário",
                price=49.99,
                stock=100,
                image_url="https://example.com/camiseta.jpg",
            ),
            Product(
                name="Clean Code",
                description="Livro sobre boas práticas de programação",
                price=79.99,
                stock=30,
                image_url="https://example.com/cleancode.jpg",
            ),
        ]

        for product in products:
            db.add(product)

        db.commit()

        # Associar produtos às categorias
        electronics = db.query(Category).filter(Category.name == "Eletrônicos").first()
        clothes = db.query(Category).filter(Category.name == "Roupas").first()
        books = db.query(Category).filter(Category.name == "Livros").first()

        smartphone = db.query(Product).filter(Product.name == "Smartphone XYZ").first()
        notebook = db.query(Product).filter(Product.name == "Notebook ABC").first()
        tshirt = db.query(Product).filter(Product.name == "Camiseta Casual").first()
        book = db.query(Product).filter(Product.name == "Clean Code").first()

        smartphone.categories.append(electronics)
        notebook.categories.append(electronics)
        tshirt.categories.append(clothes)
        book.categories.append(books)

        db.commit()

        print("Dados iniciais carregados com sucesso!")

    except Exception as e:
        print(f"Erro ao carregar dados: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
