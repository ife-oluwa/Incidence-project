from app.core.celery_app import celery_app
import time


@celery_app.task(acks_late=True)
def example_task(word: str) -> str:
    return f"test task returns {word}"


@celery_app.task(name="create_task")
def create_task(a=2, b=3, c=5):
    time.sleep(a)
    return b + c
