def test_登録に成功するとトークンが返る(client):
    response = client.post(
        "/auth/register", json={"email": "new@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert response.json()["token_type"] == "bearer"
    assert response.json()["access_token"]


def test_同じメールで登録すると409になる(client):
    client.post("/auth/register", json={"email": "dup@example.com", "password": "password123"})
    response = client.post(
        "/auth/register", json={"email": "dup@example.com", "password": "password123"}
    )
    assert response.status_code == 409


def test_短すぎるパスワードは422になる(client):
    response = client.post(
        "/auth/register", json={"email": "short@example.com", "password": "short"}
    )
    assert response.status_code == 422


def test_正しい認証情報でログインするとトークンが返る(client):
    client.post("/auth/register", json={"email": "login@example.com", "password": "password123"})
    response = client.post(
        "/auth/login", json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_誤ったパスワードでログインすると401になる(client):
    client.post("/auth/register", json={"email": "wrong@example.com", "password": "password123"})
    response = client.post(
        "/auth/login", json={"email": "wrong@example.com", "password": "incorrect"}
    )
    assert response.status_code == 401


def test_存在しないメールでログインすると401になる(client):
    response = client.post(
        "/auth/login", json={"email": "missing@example.com", "password": "password123"}
    )
    assert response.status_code == 401


def test_トークンなしでmeを呼ぶと401になる(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_不正なトークンでmeを呼ぶと401になる(client):
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401


def test_有効なトークンでmeを呼ぶと自分の情報が返る(client, auth_headers):
    headers = auth_headers("me@example.com", "password123")
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"
