from pydantic import BaseModel
import typing as t
import datetime


class UserBase(BaseModel):
    email: str
    first_name: t.Optional[str] = None
    is_active: t.Optional[bool] = True
    is_superuser: t.Optional[bool] = False
    last_name: t.Optional[str] = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: t.Optional[str]

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class Incidents(BaseModel):
    x: t.Optional[datetime.date]
    y: int

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {

                "x": "2023-06-02",
                "y": 32,

            }
        }


class Prediction(BaseModel):
    x: t.Optional[datetime.date]
    y: int

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {

                "x": "2023-06-02",
                "y": 32,

            }
        }


class Metrics(BaseModel):
    id: str
    data: t.List[dict]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "Metrics",
                "data": [
                    {
                        "x": "2023-06-02",
                        "y": 18.4
                    }
                ]
            }
        }


class MultiSeries(BaseModel):
    id: str
    data: t.List[dict]

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "Incidents",
                "data": [
                    {
                        'x': "2023-06-02",
                        'y': 18.0
                    }
                ]
            }
        }
