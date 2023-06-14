from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import typing as t
from datetime import date, datetime, timedelta
from . import models, schemas
from app.core.security import get_password_hash
import os
import influxdb_client
from decouple import config
import time

URL = config('URL')
TOKEN = config('TOKEN')
ORG = config('ORG')
BUCKET1 = config("BUCKET1")
BUCKET2 = config("BUCKET2")
BUCKET3 = config("BUCKET3")

################# Users #################


def get_user(db: Session, user_id: int) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str) -> schemas.UserBase:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> t.List[schemas.UserOut]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> schemas.User:
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_400_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return user


def edit_user(
    db: Session,
    user_id: int, user: schemas.UserEdit
) -> schemas.User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_400_NOT_FOUND, detail="User not found")
    update_data = user.dict(exclude_unset=True)

    if "password" in update_data:
        update_data['hashed_password'] = get_password_hash(user.password)
        del update_data['password']

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


############# PREDICTIONS #############


def get_monday():
    now = datetime.now()
    monday = now - timedelta(days=now.weekday())
    return monday.strftime("%Y-%m-%d")


def get_predictions() -> t.List[schemas.Prediction]:

    with influxdb_client.InfluxDBClient(
            url=URL,
            token=TOKEN,
            org=ORG) as client:
        pred_query = 'import "experimental"'\
            f'from(bucket:"{BUCKET2}")'\
            '|> range(start: -7d, stop: experimental.addDuration(d: 7d, to: now()))'\
            '|> filter(fn: (r) => r._measurement == "pred-df")'\
            '|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
        pred_records = client.query_api().query(query=pred_query)
        pred_results = [{
            'x': record['_time'].strftime('%Y-%m-%d'),
            'y': round(record['forecast']),
        } for table in pred_records for record in table.records]
    return pred_results


def get_incidents() -> t.List[schemas.Incidents]:

    with influxdb_client.InfluxDBClient(
            url=URL,
            token=TOKEN,
            org=ORG) as client:
        query = f'from(bucket:"{BUCKET1}")'\
            '|> range(start: -7, stop: now())'\
            '|> filter(fn: (r) => r._measurement == "server-df")'\
            '|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
        records = client.query_api().query(query=query)
        results = [{
            'x': record['_time'].strftime('%Y-%m-%d'),
            'y': round(record['etat_failed']),
        } for table in records for record in table.records]
    return results[-8:]


def get_next_prediction() -> schemas.Prediction:
    monday = get_monday()
    print(monday)
    with influxdb_client.InfluxDBClient(
            url=URL,
            token=TOKEN,
            org=ORG) as client:
        query = 'import "experimental"'\
            f'from(bucket:"{BUCKET2}")'\
            '|> range(start: -7d, stop: experimental.addDuration(d: 7d, to: now()))'\
            '|> filter(fn: (r) => r._measurement == "pred-df")'\
            '|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
        records = client.query_api().query(query=query)
        results = [{
            'x': record['_time'].strftime('%Y-%m-%d'),
            'y': round(record['forecast']),
        } for table in records for record in table.records if record['_time'].strftime('%Y-%m-%d') == monday]
    return results


def get_model_metrics() -> t.List[schemas.Metrics]:
    with influxdb_client.InfluxDBClient(
        url=URL,
        token=TOKEN,
        org=ORG
    ) as client:
        query = f'from(bucket:"{BUCKET3}")'\
            '|> range(start: 0, stop: now())'\
            '|> filter(fn: (r) => r._measurement == "error-df")'\
            '|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
        records = client.query_api().query(query=query)
        results = [{
            'x': datetime.strftime(record['_time'], '%Y-%m-%d'),
            'y': round(record['error'], 1),
        } for table in records for record in table.records
        ]
    print(records)
    return results
