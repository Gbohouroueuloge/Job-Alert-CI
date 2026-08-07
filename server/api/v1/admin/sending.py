from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api/admin/sending", tags=["admin-sending"])


@router.get("/sends")
async def list_sends(
    status: Optional[str] = None,
    send_type: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Historique des envois."""
    pass


@router.get("/sends/{send_id}")
async def get_send_detail(send_id: str):
    """Détail d'un envoi : destinataire, offres incluses, statut."""
    pass


@router.post("/trigger")
async def trigger_send(payload: "SendTrigger"):
    """Déclenche un envoi manuel (à tous ou à un segment)."""
    pass


@router.get("/stats")
async def get_sending_stats():
    """Taux de succès, échecs, bounces sur les 30 derniers jours."""
    pass