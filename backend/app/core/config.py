import os

PROJECT_NAME = "Incidence-Predictions"

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

API_V1_STR = "/api/v1"

DESCRIPTION = """
    ## This collection of API routes manage the backend services for the machine learning service.
"""

TAGS_METADATA = [
    {
        "name": "Auth",
        "description": "Authentication routes."
    },
    {
        "name": "User",
        "description": "User related routes."
    },
    {
        "name": "Predictions",
        "description": "Predictions related routes."
    },
]

VERSION = '0.0.1'
