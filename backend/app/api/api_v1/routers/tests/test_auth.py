from app.core import security

# Monkey patch function to shave time off tests by skipping password hashing check


def verify_password_mock(first: str, second: str):
    return True


def test_login(client, test_user, monkeypatch):
    # Patch the test to skip password hashing check for speed
    monkeypatch.setattr(security, "verify_password", verify_password_mock)

    response = client.post(
        "/api/token",
        data={"username": test_user.email, "password": "nottheactualpass"}
    )
    assert response.status_code == 200


def test_signup(client, monkeypatch):
    def get_password_hash_mock(first: str, second: str):
        return True
    monkeypatch.setattr(security, "get_password_hash", get_password_hash_mock)

    response = client.post(
        "/api/signup",
        data={"username": "some@email.com", "password": "randompassword"}
    )
    assert response.status_code == 200



