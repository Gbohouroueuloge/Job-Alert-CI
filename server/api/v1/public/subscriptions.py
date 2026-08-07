from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from api.deps import get_db
from models import ContractType, Filiere, Subscriber, SubscriberContractPreference, SubscriberFiliere, SubscriberStatus, SubscriberToken, TokenPurpose, UnsubscribeEvent
from schemas.subscriptions import SubscriberCreate, SubscriberPreferencesUpdate, SubscriberRead
from services.normalization import token_hash
from services.subscriptions import create_subscriber

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])


def _get_subscriber_by_token(db: Session, raw_token: str, purpose: TokenPurpose) -> tuple[SubscriberToken, Subscriber]:
    """Valide un token et retourne (token_obj, subscriber). Lève 404 si invalide."""
    hashed = token_hash(raw_token)
    token = db.scalar(
        select(SubscriberToken).where(
            SubscriberToken.token_hash == hashed,
            SubscriberToken.purpose == purpose,
            SubscriberToken.revoked_at.is_(None),
        )
    )
    if token is None:
        raise HTTPException(status_code=404, detail="Lien invalide ou expiré")
    subscriber = db.scalar(select(Subscriber).where(Subscriber.id == token.subscriber_id, Subscriber.deleted_at.is_(None)))
    if subscriber is None:
        raise HTTPException(status_code=404, detail="Abonné introuvable")
    return token, subscriber


@router.post("", response_model=SubscriberRead, status_code=status.HTTP_201_CREATED)
def subscribe(payload: SubscriberCreate, db: Session = Depends(get_db)):
    """Inscription email + 1 à 3 filières + préférences optionnelles."""
    try:
        return create_subscriber(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cet email est déjà inscrit")


@router.get("/confirm/{token}")
def confirm_subscription(token: str, db: Session = Depends(get_db)):
    """Confirmation d'inscription (lien dans l'email)."""
    token_obj, subscriber = _get_subscriber_by_token(db, token, TokenPurpose.CONFIRM_EMAIL) # Utiliser CONFIRM_EMAIL pour confirmer!
    if subscriber.confirmed_at is None:
        subscriber.confirmed_at = datetime.now(timezone.utc)
        subscriber.status = SubscriberStatus.ACTIVE
    db.commit()
    return {"message": "Inscription confirmée", "email": subscriber.email}


@router.post("/unsubscribe/{token}")
def unsubscribe(token: str, reason: str | None = None, db: Session = Depends(get_db)):
    """Désinscription en 1 clic (lien unique dans chaque email)."""
    token_obj, subscriber = _get_subscriber_by_token(db, token, TokenPurpose.MANAGE_ALERT)
    now = datetime.now(timezone.utc)
    subscriber.status = SubscriberStatus.UNSUBSCRIBED
    subscriber.unsubscribed_at = now
    subscriber.unsubscribe_reason = reason
    db.add(UnsubscribeEvent(subscriber_id=subscriber.id, reason=reason, source="email_link"))
    db.commit()
    return {"message": "Désinscription enregistrée"}


@router.get("/preferences/{token}", response_model=SubscriberRead)
def get_preferences(token: str, db: Session = Depends(get_db)):
    """Récupère les préférences via le token (pour page de gestion future)."""
    _, subscriber = _get_subscriber_by_token(db, token, TokenPurpose.MANAGE_ALERT)
    return subscriber


@router.put("/preferences/{token}", response_model=SubscriberRead)
def update_preferences(token: str, payload: SubscriberPreferencesUpdate, db: Session = Depends(get_db)):
    """Modifie les filières / contrats choisis."""
    _, subscriber = _get_subscriber_by_token(db, token, TokenPurpose.MANAGE_ALERT)
    
    # Mettre à jour les filières
    # Need to load relationship or clear it directly on DB. Using ORM list clear:
    subscriber.filiere_links.clear()
    unique_filieres = list(dict.fromkeys(payload.filieres))[:3]
    for index, code in enumerate(unique_filieres, start=1):
        filiere = db.scalar(select(Filiere).where((Filiere.code == code) | (Filiere.slug == code)))
        if filiere is None:
            raise HTTPException(status_code=400, detail=f"Filière inconnue: {code}")
        subscriber.filiere_links.append(SubscriberFiliere(filiere_id=filiere.id, priority=index))
        
    # Mettre à jour les contrats
    subscriber.contract_preferences.clear()
    for ct_code in dict.fromkeys(payload.contract_types):
        ct = db.scalar(select(ContractType).where(ContractType.code == ct_code))
        if ct is not None:
            subscriber.contract_preferences.append(SubscriberContractPreference(contract_type_id=ct.id))
            
    subscriber.wants_career_tips = payload.wants_career_tips
    db.commit()
    db.refresh(subscriber)
    return subscriber