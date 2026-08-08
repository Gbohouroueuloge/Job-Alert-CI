from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from api.deps import get_db
from core.config import get_settings

routerSys = APIRouter(tags=["system"])


@routerSys.get("/health")
def healthcheck(db: Session = Depends(get_db)) -> dict[str, str]:
    """Sante applicative et disponibilite de la base."""
    settings = get_settings()
    try:
        db.execute(text("SELECT 1"))
        database = "ready"
    except (SQLAlchemyError, Exception):
        database = "unavailable"

    return {
        "status": "ok" if database == "ready" else "degraded",
        "database": database,
        "environment": settings.environment,
    }


@routerSys.get("/")
def root() -> dict[str, str]:
    settings = get_settings()
    return {"message": "JobAlert CI API", "environment": settings.environment}


@routerSys.head("/")
def health_head() -> Response:
    """Réponse valide sans body pour les pings HEAD (UptimeRobot, etc.)."""
    return Response(status_code=200)