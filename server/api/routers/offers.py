from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from api.deps import get_db
from models import JobOffer, JobOfferStatus
from schemas.offers import JobOfferRead

router = APIRouter(prefix="/offers", tags=["offers"])


@router.get("", response_model=list[JobOfferRead])
def list_offers(
        db: Session = Depends(get_db),
        filiere_id: str | None = Query(default=None),
        source_id: str | None = Query(default=None),
        q: str | None = Query(default=None, min_length=2),
        limit: int = Query(default=20, ge=1, le=100),
        offset: int = Query(default=0, ge=0),
) -> list[JobOffer]:
    """Flux public des offres.

    Filtrage des le SQL sur `visible_site`, `status` et
    `deleted_at` pour ne jamais exposer par erreur une offre archivee, masquee
    ou supprimee logiquement.
    """

    stmt = (
        select(JobOffer)
        .options(
            joinedload(JobOffer.company),
            joinedload(JobOffer.source),
            joinedload(JobOffer.location),
            joinedload(JobOffer.primary_filiere),
            joinedload(JobOffer.detail),
        )
        .where(
            JobOffer.visible_site.is_(True),
            JobOffer.status == JobOfferStatus.ACTIVE,
            JobOffer.deleted_at.is_(None),
        )
        .order_by(JobOffer.published_at.desc().nullslast(), JobOffer.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    if filiere_id:
        stmt = stmt.where(JobOffer.primary_filiere_id == filiere_id)
    if source_id:
        stmt = stmt.where(JobOffer.source_id == source_id)
    if q:
        stmt = stmt.where(JobOffer.normalized_title.contains(q.lower().strip()))

    return list(db.scalars(stmt))


@router.get("/{offer_id}", response_model=JobOfferRead)
def get_offer(offer_id: str, db: Session = Depends(get_db)) -> Any | None:
    stmt = (
        select(JobOffer)
        .options(
            joinedload(JobOffer.company),
            joinedload(JobOffer.source),
            joinedload(JobOffer.location),
            joinedload(JobOffer.primary_filiere),
            joinedload(JobOffer.detail),
        )
        .where(
            JobOffer.id == offer_id,
            JobOffer.visible_site.is_(True),
            JobOffer.deleted_at.is_(None),
        )
    )
    offer = db.scalar(stmt)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    return offer
