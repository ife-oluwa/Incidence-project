from app.db import models


def test_get_predictions(client, superuser_token_headers):
    response = client.get("/api/v1/predictions",
                          headers=superuser_token_headers)
    assert response.status_code == 200
    assert len(response.json()) != 0
        


def test_get_metrics(client, superuser_token_headers):
    response = client.get("/api/v1/model-metrics/",
                          headers=superuser_token_headers)
    assert response.status_code == 200
    assert len(response.json()) != 0

    
def test_monday_pred(client, superuser_token_headers):
    response = client.get("/api/v1/monday", headers=superuser_token_headers)
    assert response.status_code == 200
    