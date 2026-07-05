def test_health(client):
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_register_and_login(client):
    resp = client.post("/auth/register", json={"email": "a@b.com", "password": "pass123"})
    assert resp.status_code == 201
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"

    resp2 = client.post("/auth/login", json={"email": "a@b.com", "password": "pass123"})
    assert resp2.status_code == 200
    assert "access_token" in resp2.json()


def test_register_duplicate_email(client):
    client.post("/auth/register", json={"email": "dup@b.com", "password": "pass"})
    resp = client.post("/auth/register", json={"email": "dup@b.com", "password": "other"})
    assert resp.status_code == 400


def test_login_wrong_password(client):
    client.post("/auth/register", json={"email": "x@b.com", "password": "correct"})
    resp = client.post("/auth/login", json={"email": "x@b.com", "password": "wrong"})
    assert resp.status_code == 401


def test_habits_require_auth(client):
    resp = client.get("/habits")
    assert resp.status_code == 401  # no token


def test_list_habits_empty(auth_client):
    resp = auth_client.get("/habits")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_habit(auth_client):
    resp = auth_client.post("/habits", json={"name": "読書", "category": "学習"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "読書"
    assert data["category"] == "学習"
    assert data["archived"] is False
    assert data["checkedDates"] == []
    assert "id" in data


def test_get_habit(auth_client):
    created = auth_client.post("/habits", json={"name": "運動"}).json()
    resp = auth_client.get(f"/habits/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "運動"


def test_get_habit_not_found(auth_client):
    resp = auth_client.get("/habits/nonexistent")
    assert resp.status_code == 404


def test_update_habit(auth_client):
    created = auth_client.post("/habits", json={"name": "運動"}).json()
    resp = auth_client.put(f"/habits/{created['id']}", json={"name": "筋トレ", "archived": True})
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "筋トレ"
    assert data["archived"] is True


def test_delete_habit(auth_client):
    created = auth_client.post("/habits", json={"name": "日記"}).json()
    resp = auth_client.delete(f"/habits/{created['id']}")
    assert resp.status_code == 204
    assert auth_client.get(f"/habits/{created['id']}").status_code == 404


def test_add_and_remove_log(auth_client):
    created = auth_client.post("/habits", json={"name": "瞑想"}).json()
    habit_id = created["id"]

    resp = auth_client.post(f"/habits/{habit_id}/logs", json={"date": "2026-06-25"})
    assert resp.status_code == 200
    assert "2026-06-25" in resp.json()["checkedDates"]

    # 重複追加は冪等
    resp2 = auth_client.post(f"/habits/{habit_id}/logs", json={"date": "2026-06-25"})
    assert resp2.status_code == 200
    assert resp2.json()["checkedDates"].count("2026-06-25") == 1

    # チェック取り消し
    resp3 = auth_client.delete(f"/habits/{habit_id}/logs/2026-06-25")
    assert resp3.status_code == 200
    assert "2026-06-25" not in resp3.json()["checkedDates"]


def test_list_habits_includes_checked_dates(auth_client):
    created = auth_client.post("/habits", json={"name": "水を飲む"}).json()
    habit_id = created["id"]
    auth_client.post(f"/habits/{habit_id}/logs", json={"date": "2026-06-24"})
    auth_client.post(f"/habits/{habit_id}/logs", json={"date": "2026-06-25"})

    habits = auth_client.get("/habits").json()
    assert len(habits) == 1
    assert habits[0]["checkedDates"] == ["2026-06-24", "2026-06-25"]


def test_other_user_cannot_access_habit(client):
    """別ユーザーのハビットは見えない"""
    r1 = client.post("/auth/register", json={"email": "user1@b.com", "password": "pass"})
    token1 = r1.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token1}"})
    habit = client.post("/habits", json={"name": "秘密の習慣"}).json()

    r2 = client.post("/auth/register", json={"email": "user2@b.com", "password": "pass"})
    token2 = r2.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token2}"})

    resp = client.get(f"/habits/{habit['id']}")
    assert resp.status_code == 404
