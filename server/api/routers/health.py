from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from api.deps import get_db
from core.config import get_settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def healthcheck(db: Session = Depends(get_db)) -> dict[str, str]:
    """Contrôle applicatif et base de donnees.

    Un endpoint de santé doit tester la DB, pas seulement retourner
    "ok", sinon l'orchestrateur peut garder une API vivante, mais inutilisable.
    """

    settings = get_settings()
    try:
        db.execute(text("SELECT 1"))
        database = "ready"
    except SQLAlchemyError:
        database = "unavailable"

    return {
        "status": "ok" if database == "ready" else "degraded",
        "database": database,
        "environment": settings.environment,
    }
