from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1.router import api_router
from api.system import routerSys
from core.config import get_settings
from db.session import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # En production, Alembic doit piloter le schema. Ce flag reste pratique pour
    # un dev local ou une CI ephemere sans migration prealable.
    if settings.auto_create_tables:
        init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend robuste et evolutif pour JobAlert CI.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routerSys)

# Toutes les routes passent par le router v1.
app.include_router(api_router)

