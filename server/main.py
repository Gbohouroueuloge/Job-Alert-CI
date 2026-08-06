from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import contact, health, offers, referentials, stats, subscriptions
from core.config import get_settings
from db.session import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # En production on prefere Alembic pour garder un historique reversible.
    # AUTO_CREATE_TABLES reste pratique en dev local ou en CI ephemeral.
    if settings.auto_create_tables:
        init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(referentials.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(offers.router,  prefix="/api")
app.include_router(subscriptions.router,  prefix="/api")
app.include_router(contact.router,  prefix="/api")


@app.get("/", tags=["system"])
async def root() -> dict[str, str]:
    return {"message": "JobAlert CI API", "environment": settings.environment}
