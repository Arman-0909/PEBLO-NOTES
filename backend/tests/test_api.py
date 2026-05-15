import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_register_user():
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "User created successfully"

def test_login_user():
    response = client.post(
        "/auth/login",
        json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_create_note():
    # Login first
    login_response = client.post(
        "/auth/login",
        json={"username": "testuser", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]
    
    response = client.post(
        "/notes/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Note",
            "content": "This is a test note.",
            "tags": "test, api"
        }
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Note created successfully"
    assert response.json()["note"]["title"] == "Test Note"

def test_get_notes():
    # Login first
    login_response = client.post(
        "/auth/login",
        json={"username": "testuser", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]
    
    response = client.get(
        "/notes/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "notes" in response.json()
    assert len(response.json()["notes"]) > 0
    assert response.json()["notes"][0]["title"] == "Test Note"
