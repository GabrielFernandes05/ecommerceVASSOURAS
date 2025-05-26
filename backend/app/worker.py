from celery import Celery
from app.core.config import settings

celery = Celery(
    "worker",
    broker=settings.RABBITMQ_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks"],
)

celery.conf.task_routes = {"app.tasks.*": {"queue": "main-queue"}}
