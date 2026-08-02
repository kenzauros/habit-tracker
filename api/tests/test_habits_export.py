def _create_habit(client, headers, name="運動", category="健康"):
    return client.post("/habits", json={"name": name, "category": category}, headers=headers)


def test_未認証でCSVエクスポートを呼ぶと401になる(client):
    response = client.get("/habits/dummy-id/check-ins/export")
    assert response.status_code == 401


def test_存在しないhabit_idでエクスポートすると404になる(client, auth_headers):
    headers = auth_headers()
    response = client.get("/habits/not-exist/check-ins/export", headers=headers)
    assert response.status_code == 404


def test_チェックインがない習慣はヘッダー行のみのCSVになる(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]

    response = client.get(f"/habits/{habit_id}/check-ins/export", headers=headers)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert response.content.decode("utf-8-sig") == "date\r\n"


def test_チェックイン済みの習慣は日付が昇順のCSVで返る(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers).json()["id"]
    client.post(f"/habits/{habit_id}/check-ins", json={"date": "2026-07-25"}, headers=headers)
    client.post(f"/habits/{habit_id}/check-ins", json={"date": "2026-07-11"}, headers=headers)

    response = client.get(f"/habits/{habit_id}/check-ins/export", headers=headers)
    assert response.status_code == 200
    assert response.content.decode("utf-8-sig") == "date\r\n2026-07-11\r\n2026-07-25\r\n"


def test_エクスポートのContent_Dispositionに習慣名がURLエンコードされて含まれる(client, auth_headers):
    headers = auth_headers()
    habit_id = _create_habit(client, headers, name="運動").json()["id"]

    response = client.get(f"/habits/{habit_id}/check-ins/export", headers=headers)
    disposition = response.headers["content-disposition"]
    assert "attachment;" in disposition
    assert "filename*=UTF-8''%E9%81%8B%E5%8B%95_check-ins.csv" in disposition
