#!/usr/bin/env python3

from app.db.session import get_db
from app.db.crud import create_user
from app.db.schemas import UserCreate
from app.db.session import SessionLocal
from datetime import date


def init() -> None:
    db = SessionLocal()

    db_user = create_user(
        db,
        UserCreate(
            email='ifeoluwaa917@gmail.com',
            first_name='Gideon',
            password='admin',
            is_active=True,
            is_superuser=True,
        )
    )


if __name__ == '__main__':
    print('Creating superuser ifeoluwaa917@gmail.com')
    init()
    print("Super user created")
