def _create_habit(client, headers, name="運動"):
    return client.post("/habits", json={"name": name, "category": ""}, headers=headers)


def test_他ユーザーの一覧には表示されない(client, auth_headers):
    headers_a = auth_headers("a@example.com", "password123")
    headers_b = auth_headers("b@example.com", "password123")
    _create_habit(client, headers_a)

    response = client.get("/habits", headers=headers_b)
    assert response.status_code == 200
    assert response.json() == []


def test_他ユーザーの習慣は編集できず404になる(client, auth_headers):
    headers_a = auth_headers("owner@example.com", "password123")
    headers_b = auth_headers("intruder@example.com", "password123")
    habit_id = _create_habit(client, headers_a).json()["id"]

    response = client.patch(
        f"/habits/{habit_id}", json={"name": "改変", "category": ""}, headers=headers_b
    )
    assert response.status_code == 404


def test_他ユーザーの習慣にチェックインできず404になる(client, auth_headers):
    headers_a = auth_headers("owner2@example.com", "password123")
    headers_b = auth_headers("intruder2@example.com", "password123")
    habit_id = _create_habit(client, headers_a).json()["id"]

    response = client.post(
        f"/habits/{habit_id}/check-ins", json={"date": "2026-07-11"}, headers=headers_b
    )
    assert response.status_code == 404


def test_他ユーザーの習慣をアーカイブできず404になる(client, auth_headers):
    headers_a = auth_headers("owner3@example.com", "password123")
    headers_b = auth_headers("intruder3@example.com", "password123")
    habit_id = _create_habit(client, headers_a).json()["id"]

    response = client.post(f"/habits/{habit_id}/archive", headers=headers_b)
    assert response.status_code == 404


def test_リクエストボディにuser_idを渡しても無視される(client, auth_headers):
    headers_a = auth_headers("owner4@example.com", "password123")
    headers_b = auth_headers("intruder4@example.com", "password123")
    habit_id = _create_habit(client, headers_a).json()["id"]

    response = client.post(
        "/habits",
        json={"name": "偽装", "category": "", "user_id": "someone-else"},
        headers=headers_b,
    )
    assert response.status_code == 201

    listed_a = client.get("/habits", headers=headers_a)
    assert all(habit["id"] != habit_id or habit["name"] != "偽装" for habit in listed_a.json())
