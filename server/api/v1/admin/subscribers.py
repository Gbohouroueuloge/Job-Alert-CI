from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from datetime import datetime

from api.deps import get_db
from models.subscriptions import Subscriber, SubscriberStatus
from models.emails import EmailDigest
from schemas.subscriptions import (
    SubscriberRead, SubscriberAdminUpdate, SubscriberStatusUpdate
)
from schemas.sending import EmailDigestRead, CustomSendCreate

router = APIRouter(prefix="/api/admin/subscribers", tags=["admin-subscribers"])


@router.get("", response_model=list[SubscriberRead])
async def list_subscribers(
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    status: Optional[str] = None,
    filiere_id: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Liste des abonnés avec filtres."""
    stmt = select(Subscriber)
    
    if q:
        stmt = stmt.where(
            (Subscriber.email.ilike(f"%{q}%")) |
            (Subscriber.full_name.ilike(f"%{q}%"))
        )
    if status:
        stmt = stmt.where(Subscriber.status == status)
    
    if filiere_id:
        from models.subscriptions import SubscriberFiliere
        stmt = stmt.join(Subscriber.filiere_links).where(SubscriberFiliere.filiere_id == filiere_id)
        
    stmt = stmt.order_by(Subscriber.subscribed_at.desc())
    return list(db.scalars(stmt.limit(limit).offset(offset)).unique())


@router.get("/{subscriber_id}", response_model=SubscriberRead)
async def get_subscriber(subscriber_id: str, db: Session = Depends(get_db)):
    """Détail : profil, filières, historique envois, notes."""
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == subscriber_id))
    if not subscriber:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
    return subscriber


@router.put("/{subscriber_id}", response_model=SubscriberRead)
async def update_subscriber(subscriber_id: str, payload: SubscriberAdminUpdate, db: Session = Depends(get_db)):
    """Édition (statut, notes admin)."""
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == subscriber_id))
    if not subscriber:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
        
    if payload.status:
        subscriber.status = SubscriberStatus(payload.status)
    if payload.admin_notes is not None:
        subscriber.admin_notes = payload.admin_notes
        
    db.commit()
    db.refresh(subscriber)
    return subscriber


@router.patch("/{subscriber_id}/status")
async def update_subscriber_status(subscriber_id: str, payload: SubscriberStatusUpdate, db: Session = Depends(get_db)):
    """Active / désinscrit / bouncing."""
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == subscriber_id))
    if not subscriber:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
    subscriber.status = SubscriberStatus(payload.status)
    if payload.status == "unsubscribed":
        subscriber.unsubscribed_at = datetime.utcnow()
    db.commit()
    return {"message": "Statut mis à jour"}


@router.get("/{subscriber_id}/sends", response_model=list[EmailDigestRead])
async def get_subscriber_sends(subscriber_id: str, limit: int = 20, db: Session = Depends(get_db)):
    """Historique des envois pour un abonné."""
    stmt = (
        select(EmailDigest)
        .where(EmailDigest.subscriber_id == subscriber_id)
        .order_by(EmailDigest.sent_at.desc().nullslast())
        .limit(limit)
    )
    return list(db.scalars(stmt))


@router.post("/{subscriber_id}/send")
async def send_custom_email(subscriber_id: str, payload: CustomSendCreate, db: Session = Depends(get_db)):
    """Envoi personnalisé d'offres sélectionnées à un abonné."""
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == subscriber_id))
    if not subscriber:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
        
    # In a real app we would queue the email here
    return {"message": "Envoi programmé", "offers_count": len(payload.offer_ids)}


@router.delete("/{subscriber_id}", status_code=204)
async def delete_subscriber(subscriber_id: str, db: Session = Depends(get_db)):
    """Suppression RGPD (anonymisation)."""
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == subscriber_id))
    if not subscriber:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
    
    subscriber.email = f"deleted_{subscriber.id}@anonymized.local"
    subscriber.email_normalized = f"deleted_{subscriber.id}@anonymized.local"
    subscriber.full_name = "Anonymized User"
    subscriber.status = SubscriberStatus.UNSUBSCRIBED
    subscriber.deleted_at = datetime.utcnow()
    db.commit()