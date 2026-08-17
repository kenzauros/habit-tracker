def _create_habit(client, headers, name="運動", category="健康"):
    return client.post("/habits", json={"name": name, "category": category}, headers=headers)


def test_未認証でhabitsを呼ぶと401になる(client):
    response = client.get("/habits")
    assert response.status_code == 401


def test_習慣を作成すると201で返る(client, auth_headers):
    headers = auth_headers()
    response = _create_habit(client, headers)
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "運動"
    assert body["archived"] is False
    assert body["checkIns"] == []


def test_空文字の名前で作成すると422になる(client, auth_headers):
    headers = auth_headers()
    response = _create_habit(client, headers, name="   ")
    assert response.status_code == 422


def test_同じ名前で作成すると409になる(client, auth_headers):
    headers = auth_headers()
    _create_habit(client, headers, name="読書")
    response = _create_habit(client, headers, name="読書")
    assert response.status_code == 409


def test_作成した習慣が一覧に含まれる(client, auth_headers):
    headers = auth_headers()
    _create_habit(client, headers)
    response = client.get("/habits", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_名前を編集すると反映される(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    response = client.patch(
        f"/habits/{habit_id}", json={"name": "筋トレ", "category": "健康"}, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "筋トレ"


def test_チェックインすると当日の日付が追加される(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    response = client.post(
        f"/habits/{habit_id}/check-ins", json={"date": "2026-07-11"}, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["checkIns"] == ["2026-07-11"]


def test_同じ日に二回チェックインしても重複しない(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    client.post(f"/habits/{habit_id}/check-ins", json={"date": "2026-07-11"}, headers=headers)
    response = client.post(
        f"/habits/{habit_id}/check-ins", json={"date": "2026-07-11"}, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["checkIns"] == ["2026-07-11"]


def test_アーカイブすると一覧から消えずarchivedがtrueになる(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    response = client.post(f"/habits/{habit_id}/archive", headers=headers)
    assert response.status_code == 200
    assert response.json()["archived"] is True

    listed = client.get("/habits", headers=headers)
    assert len(listed.json()) == 1


def test_アーカイブを戻すとarchivedがfalseになる(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    client.post(f"/habits/{habit_id}/archive", headers=headers)
    response = client.post(f"/habits/{habit_id}/unarchive", headers=headers)
    assert response.status_code == 200
    assert response.json()["archived"] is False


def test_下に並べ替えると順序が入れ替わる(client, auth_headers):
    headers = auth_headers()
    first_id = _create_habit(client, headers, name="読書").json()["id"]
    second_id = _create_habit(client, headers, name="運動").json()["id"]

    response = client.patch(
        f"/habits/{first_id}/reorder", json={"direction": "down"}, headers=headers
    )
    assert response.status_code == 200
    assert [habit["id"] for habit in response.json()] == [second_id, first_id]
