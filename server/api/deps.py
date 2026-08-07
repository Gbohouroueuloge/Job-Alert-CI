from __future__ import annotations

from fastapi import Header, HTTPException, status

from core.config import get_settings
from db.session import get_db


def require_admin_api_key(x_admin_api_key: str | None = Header(default=None)) -> None:
    """Protection simple des routes admin.

    C'est volontairement minimal pour le socle. Le modele Administrator permet
    ensuite de remplacer cette cle par JWT/session sans toucher aux routes.
    """

    settings = get_settings()
    if not settings.admin_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Admin API non configuree")
    if x_admin_api_key != settings.admin_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cle admin invalide")


__all__ = ["get_db", "require_admin_api_key"]
