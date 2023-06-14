from fastapi import APIRouter, Request, Depends, Response, encoders
import typing as t

from app.db.session import get_db
from app.db.crud import (
    get_user,
    get_users,
    create_user,
    delete_user,
    edit_user,
)
from app.db.schemas import UserCreate, UserEdit, User, UserOut
from app.core.auth import get_current_active_superuser, get_current_active_user

users_router = r = APIRouter(
    tags=['User']
)


@r.get(
    "/users",
    response_model=t.List[User],
    response_model_exclude_none=True
)
async def users_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser)
):
    """
    Get all users
    """
    users = get_users(db)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(users)}"
    return users


@r.get("/users/me", response_model=User, response_model_exclude_none=True)
async def user_me(current_user=Depends(get_current_active_user)):
    """
    Get own user
    """
    return current_user


@r.get(
    "/users/{user_id}",
    response_model=User,
    response_model_exclude_none=True
)
async def user_details(
    response: Response,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser)
):
    """Get any user details

    Args:
        request (Request): _description_
        user_id (int): _description_
        db (_type_, optional): _description_. Defaults to Depends(get_db).
        current_user (_type_, optional): _description_. Defaults to Depends(get_current_active_superuser).
    """
    user = get_user(db, user_id)
    response.headers["Content-Range"] = "0-9/1"
    return user


@r.post("/users", response_model=User, response_model_exclude_none=True)
async def user_create(
    request: Request,
    user: UserCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """Create a new user

    Args:
        request (Request): _description_
        user (UserCreate): _description_
        db (_type_, optional): _description_. Defaults to Depends(get_db).
        current_user (_type_, optional): _description_. Defaults to Depends(get_current_active_superuser).
    """
    return create_user(db, user)


@r.put(
    "/users/{user_id}", response_model=User, response_model_exclude_none=True
)
async def user_edit(
    request: Request,
    user_id: int,
    user: UserEdit,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser)
):
    """_summary_
    Update exisiting user

    Args:
        request (Request): _description_
        user_id (int): _description_
        user (UserEdit): _description_
        db (_type_, optional): _description_. Defaults to Depends(get_db).
        current_user (_type_, optional): _description_. Defaults to Depends(get_current_active_superuser).
    """
    return edit_user(db, user_id, user)


@r.delete(
    "/users/{user_id}", response_model=User, response_model_exclude_none=True
)
async def user_delete(
    request: Request,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser)
):
    """_summary_
    Delete existing user

    Args:
        request (Request): _description_
        user_id (int): _description_
        db (_type_, optional): _description_. Defaults to Depends(get_db).
        current_user (_type_, optional): _description_. Defaults to Depends(get_current_active_superuser).
    """
    return delete_user(db, user_id)
