from fastapi.testclient import TestClient
from app.schemas.user import UserCreate


def test_create_user(client):
    user_data = {
        "email": "test@example.com",
        "password": "securepass",
        "name": "Test User",
        "address": "123 Test St",
    }
    response = client.post("/api/v1/users/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["name"] == user_data["name"]
    assert "id" in data


def test_login_user(client):
    # Primeiro criar um usuário
    user_data = {
        "email": "login_test@example.com",
        "password": "securepass",
        "name": "Login Test User",
        "address": "123 Login St",
    }
    client.post("/api/v1/users/register", json=user_data)

    # Tentar fazer login
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
