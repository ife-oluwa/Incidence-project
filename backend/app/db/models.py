from sqlalchemy import Boolean, Column, Integer, String, Date, ForeignKey
from .session import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    predictions = relationship('Prediction', back_populates='user')


class Prediction(Base):
    __tablename__ = 'prediction'
    id = Column(Integer, primary_key=True, index=True)
    date_created = Column(Date, server_default=func.now())
    predictions = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='predictions')
