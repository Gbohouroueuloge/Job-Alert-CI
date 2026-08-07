from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from api.deps import get_current_admin, get_db, require_roles
from models.admin import AdminAction, Administrator
from models.emails import EmailDigest
from models.enums import DigestStatus
from models.subscriptions import Subscriber, SubscriberFiliere, SubscriberStatus
from models.referentials import Filiere
from schemas.sending import EmailDigestRead, SendingStatsRead, SendTrigger
from services.audit import log_admin_action

# L'envoi personnalise touche directement les abonnes: gestionnaire_utilisateurs + super_admin.
router = APIRouter(
    prefix="/api/admin/sending",
    tags=["admin-sending"],
    dependencies=[Depends(require_roles("super_admin", "gestionnaire_utilisateurs"))],
)


@router.get("/sends", response_model=list[EmailDigestRead])
async def list_sends(
    db: Session = Depends(get_db),
    status: Optional[str] = Query(None, description="queued, sending, sent, failed, cancelled, skipped_empty"),
    send_type: Optional[str] = Query(None, description="'manual' pour les envois personnalisés, 'v1' pour les digests automatiques"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Historique des envois (digests quotidiens + envois personnalisés)."""
    stmt = select(EmailDigest).options(selectinload(EmailDigest.offer_links))
    if status:
        stmt = stmt.where(EmailDigest.status == status)
    if send_type:
        stmt = stmt.where(EmailDigest.template_version == send_type)
    stmt = stmt.order_by(EmailDigest.created_at.desc()).limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.get("/sends/{send_id}", response_model=EmailDigestRead)
async def get_send_detail(send_id: str, db: Session = Depends(get_db)):
    """Détail d'un envoi : destinataire, offres incluses, statut."""
    digest = db.scalar(
        select(EmailDigest).options(selectinload(EmailDigest.offer_links)).where(EmailDigest.id == send_id)
    )
    if not digest:
        raise HTTPException(status_code=404, detail="Envoi introuvable")
    return digest


@router.post("/trigger", status_code=201, response_model=list[EmailDigestRead])
async def trigger_send(
    payload: SendTrigger,
    db: Session = Depends(get_db),
    admin: Administrator = Depends(get_current_admin),
):
    """Déclenche la mise en file d'un envoi (à tous les abonnés actifs ou à un segment/abonné).

    Crée les `email_digests` en statut `queued`; l'envoi effectif (SMTP/API
    email) est porté par le worker d'envoi, hors périmètre de cette API.
    """
    digest_date = payload.date_override or date.today()
    now = datetime.now(timezone.utc)

    stmt = select(Subscriber).where(Subscriber.status == SubscriberStatus.ACTIVE, Subscriber.deleted_at.is_(None))
    if payload.subscriber_id:
        stmt = stmt.where(Subscriber.id == payload.subscriber_id)
    if payload.filiere_code:
        stmt = (
            stmt.join(Subscriber.filiere_links)
            .join(Filiere, Filiere.id == SubscriberFiliere.filiere_id)
            .where(Filiere.code == payload.filiere_code)
        )

    subscribers = list(db.scalars(stmt).unique())
    if not subscribers:
        raise HTTPException(status_code=404, detail="Aucun abonné correspondant")

    created_digests = []
    for subscriber in subscribers:
        existing = db.scalar(
            select(EmailDigest).where(EmailDigest.subscriber_id == subscriber.id, EmailDigest.digest_date == digest_date)
        )
        if existing:
            continue
        digest = EmailDigest(
            subscriber_id=subscriber.id,
            digest_date=digest_date,
            scheduled_for=now,
            status=DigestStatus.QUEUED,
        )
        db.add(digest)
        created_digests.append(digest)

    db.flush()
    log_admin_action(
        db, admin_id=admin.id, action=AdminAction.SEND, target_table="email_digests",
        details={"count": len(created_digests), "subscriber_id": payload.subscriber_id, "filiere_code": payload.filiere_code},
    )
    db.commit()
    for digest in created_digests:
        db.refresh(digest)
    return created_digests


@router.get("/stats", response_model=SendingStatsRead)
async def get_sending_stats(db: Session = Depends(get_db), period_days: int = Query(30, ge=1, le=365)):
    """Taux de succès, échecs, sauts sur la période donnée."""
    since = datetime.now(timezone.utc) - timedelta(days=period_days)
    stmt = select(EmailDigest.status, func.count(EmailDigest.id)).where(EmailDigest.created_at >= since).group_by(EmailDigest.status)
    counts = {status_value.value if hasattr(status_value, "value") else status_value: count for status_value, count in db.execute(stmt)}

    total_sent = counts.get(DigestStatus.SENT.value, 0)
    total_failed = counts.get(DigestStatus.FAILED.value, 0)
    total_skipped = counts.get(DigestStatus.SKIPPED_EMPTY.value, 0) + counts.get(DigestStatus.CANCELLED.value, 0)
    denominator = total_sent + total_failed
    success_rate = round((total_sent / denominator) * 100, 2) if denominator else 0.0

    return SendingStatsRead(
        period_days=period_days,
        total_sent=total_sent,
        total_failed=total_failed,
        total_skipped=total_skipped,
        success_rate=success_rate,
    )