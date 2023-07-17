from fastapi import FastAPI, Depends
from starlette.requests import Request
import uvicorn

from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.auth import auth_router
from app.api.api_v1.routers.predictions import pred_router
from app.core import config
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from app.core.celery_app import celery_app
from app import tasks
import sentry_sdk

sentry_sdk.init(
    dsn="https://61d95973bede4bef85d6099ea9c09d15@o4505470531928064.ingest.sentry.io/4505470535204864",

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api",
    description=config.DESCRIPTION,
    version=config.VERSION,
    openapi_tags=config.TAGS_METADATA
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}

@app.get("/api/v1/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


@app.get("/api/v1/task")
async def example_task():
    celery_app.send_task("app.tasks.example_task", args=["Hello World"])

    return {"message": "success"}

# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["User"],
    dependencies=[Depends(get_current_active_user)]
)
app.include_router(
    pred_router,
    prefix="/api/v1",
    tags=["Predictions"],
    dependencies=[Depends(get_current_active_user)]
)
app.include_router(auth_router, prefix="/api", tags=['Auth'])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
