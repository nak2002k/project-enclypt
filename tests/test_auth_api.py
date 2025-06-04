import os
import sys
from pathlib import Path


from app.main import app
from app.db.session import Base, engine

codex/create-full-auth-system-with-signup-and-login
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if DB_PATH.exists():
        DB_PATH.unlink()

def register_user(email="user@example.com", password="pw"):
    return client.post('/api/register', data={'email': email, 'password': password})

def login_user(email="user@example.com", password="pw"):
    return client.post('/api/token', data={'username': email, 'password': password})

def test_register_and_login_flow():
    r = register_user()
    assert r.status_code == 200
    data = r.json()
    assert data['email'] == 'user@example.com'
    assert 'license_key' in data
    r = login_user()
    assert r.status_code == 200
    token = r.json()['access_token']
    assert token
    r = client.get('/api/dashboard', headers={'Authorization': f'Bearer {token}'})
    assert r.status_code == 200
    dash = r.json()
    assert dash['email'] == 'user@example.com'
    assert dash['tier'] == 'account'

def test_login_wrong_password():
    register_user()
    r = login_user(password='wrong')
    assert r.status_code == 401

