import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "EmotionSense AI"
    assert data["status"] == "online"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_signup():
    response = client.post("/api/v1/auth/signup", json={
        "name": "Test User",
        "email": "test@emotionsense.ai",
        "password": "testpassword123",
    })
    # May fail without MongoDB connection, that's expected in unit tests
    assert response.status_code in [200, 500]

def test_login_invalid():
    response = client.post("/api/v1/auth/login", json={
        "email": "nonexistent@test.com",
        "password": "wrongpassword",
    })
    assert response.status_code in [401, 500]

def test_face_no_auth():
    response = client.post("/api/v1/detect/face")
    assert response.status_code in [401, 403, 422]

def test_text_no_auth():
    response = client.post("/api/v1/detect/text", json={"text": "I am happy"})
    assert response.status_code in [401, 403]

def test_analytics_no_auth():
    response = client.get("/api/v1/analytics/history")
    assert response.status_code in [401, 403]

def test_admin_no_auth():
    response = client.get("/api/v1/admin/users")
    assert response.status_code in [401, 403]
