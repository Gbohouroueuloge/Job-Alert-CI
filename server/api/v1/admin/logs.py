from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api/admin/logs", tags=["admin-logs"])


# ─── Journal d'audit admin ─────────────────────────────
@router.get("/audit")
async def list_audit_logs(
    admin_id: Optional[str] = None,
    action: Optional[str] = None,
    target_table: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Historique des actions admin."""
    pass


# ─── Logs événements (scraping, envoi…) ────────────────
@router.get("/events")
async def list_event_logs(
    module: Optional[str] = None,
    level: Optional[str] = None,
    source_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Logs techniques filtrables par module et niveau."""
    pass


# ─── Messages de contact ───────────────────────────────
@router.get("/contacts")
async def list_contact_messages(
    status: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    pass

@router.patch("/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, payload: "ContactStatusUpdate"):
    pass