from app.db import models


def test_get_predictions(client, test_superuser, superuser_token_headers):
    response = client.get("/api/v1/predictions",
                          headers=superuser_token_headers)
    assert response.status_code == 200
    assert response.json() == [
        {
            "name": "Predictions",
            "data": [
                {
                    "date": "2023-06-03",
                    "value": 29
                },
                {
                    "date": "2023-06-04",
                    "value": 40
                },
                {
                    "date": "2023-06-05",
                    "value": 60
                },
                {
                    "date": "2023-06-06",
                    "value": 75
                },
                {
                    "date": "2023-06-07",
                    "value": 71
                }
            ]
        },
        {
            "name": "Incidents",
            "data": [
                {
                    "date": "2023-05-20",
                    "value": 49
                },
                {
                    "date": "2023-05-21",
                    "value": 60
                },
                {
                    "date": "2023-05-22",
                    "value": 62
                },
                {
                    "date": "2023-05-23",
                    "value": 76
                },
                {
                    "date": "2023-05-24",
                    "value": 75
                },
                {
                    "date": "2023-05-25",
                    "value": 69
                },
                {
                    "date": "2023-05-26",
                    "value": 96
                },
                {
                    "date": "2023-05-27",
                    "value": 66
                },
                {
                    "date": "2023-05-28",
                    "value": 55
                },
                {
                    "date": "2023-05-29",
                    "value": 51
                },
                {
                    "date": "2023-05-30",
                    "value": 66
                },
                {
                    "date": "2023-05-31",
                    "value": 43
                },
                {
                    "date": "2023-06-01",
                    "value": 44
                },
                {
                    "date": "2023-06-02",
                    "value": 32
                }
            ]
        }
    ]


def test_get_metrics(client, test_superuser, superuser_token_headers):
    response = client.get("/api/v1/model-metrics/",
                          headers=superuser_token_headers)
    assert response.status_code == 200
    assert response.json() == [
        {
            "date": "2023-06-07",
            "error": 18.5
        }
    ]
