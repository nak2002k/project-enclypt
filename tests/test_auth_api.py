import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app
from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_register_login_encrypt():
    # 1) register
    resp = client.post('/api/register', data={'email':'user@example.com','password':'secret'})
    assert resp.status_code == 200
    data = resp.json()
    assert 'license_key' in data

    # 2) login to get token
    resp = client.post('/api/token', data={'username':'user@example.com','password':'secret'})
    assert resp.status_code == 200
    token = resp.json()['access_token']
    assert token

    # 3) encrypt a small file
    headers = {'Authorization': f'Bearer {token}'}
    files = {'file': ('test.txt', b'hello')}
    resp = client.post('/api/encrypt', headers=headers, files=files, data={'method':'fernet'})
    assert resp.status_code == 200
    assert 'attachment' in resp.headers.get('content-disposition', '')


def teardown_module(module):
    try:
        os.remove('test.db')
    except FileNotFoundError:
        pass
