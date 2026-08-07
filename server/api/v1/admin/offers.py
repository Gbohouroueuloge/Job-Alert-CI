from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from datetime import datetime

from api.deps import get_db
from models.jobs import JobOffer, JobOfferStatus, JobOfferDetail
from schemas.offers import (
    JobOfferRead, OfferCreate, OfferUpdate, OfferVisibilityUpdate, 
    OfferStatusUpdate, OfferBulkStatusUpdate
)
from api.v1.public.offers import _load_offer_relations

router = APIRouter(prefix="/api/admin/offers", tags=["admin-offers"])


@router.get("", response_model=list[JobOfferRead])
async def list_offers_admin(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Recherche dans le titre"),
    filiere_id: Optional[str] = Query(None, description="ID de filière"),
    source_id: Optional[str] = Query(None, description="ID de source"),
    status: Optional[str] = Query(None, description="Statut exact de l'offre"),
    visible_site: Optional[bool] = Query(None, description="Visibilité publique"),
    origin: Optional[str] = Query(None, description="Origine (scraping/manuel)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Liste complète (y compris masquées/archivées)."""
    stmt = select(JobOffer).options(*_load_offer_relations())
    
    if q:
        stmt = stmt.where(JobOffer.title.ilike(f"%{q}%"))
    if filiere_id:
        stmt = stmt.where(JobOffer.primary_filiere_id == filiere_id)
    if source_id:
        stmt = stmt.where(JobOffer.source_id == source_id)
    if status:
        stmt = stmt.where(JobOffer.status == status)
    if visible_site is not None:
        stmt = stmt.where(JobOffer.visible_site == visible_site)
    if origin:
        stmt = stmt.where(JobOffer.origin == origin)
        
    stmt = stmt.order_by(JobOffer.created_at.desc())
    return list(db.scalars(stmt.limit(limit).offset(offset)).unique())


@router.get("/{offer_id}", response_model=JobOfferRead)
async def get_offer_admin(offer_id: str, db: Session = Depends(get_db)):
    """Détail complet admin."""
    stmt = select(JobOffer).options(*_load_offer_relations()).where(JobOffer.id == offer_id)
    offer = db.scalar(stmt)
    if not offer:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    return offer


@router.post("", status_code=201, response_model=JobOfferRead)
async def create_offer(payload: OfferCreate, db: Session = Depends(get_db)):
    """Ajout manuel d'une offre (origin=manuel)."""
    from services.normalization import normalize_text
    
    new_offer = JobOffer(
        title=payload.title,
        normalized_title=normalize_text(payload.title),
        source_url=payload.source_url,
        origin="manual",
        status=JobOfferStatus.ACTIVE,
        visible_site=True
        # Add other fields as necessary depending on real schema mapping
        # since company, source, etc. require looking up IDs. 
        # Skipping for the brevity of this stub unless the service already does it.
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    return new_offer


@router.put("/{offer_id}", response_model=JobOfferRead)
async def update_offer(offer_id: str, payload: OfferUpdate, db: Session = Depends(get_db)):
    """Édition d'une offre."""
    offer = db.scalar(select(JobOffer).where(JobOffer.id == offer_id))
    if not offer:
        raise HTTPException(status_code=404, detail="Offre introuvable")
        
    if payload.title is not None:
        offer.title = payload.title
    if payload.visible_site is not None:
        offer.visible_site = payload.visible_site
    # Add other mappings
    db.commit()
    db.refresh(offer)
    
    # Reload with relations to match response_model
    return db.scalar(select(JobOffer).options(*_load_offer_relations()).where(JobOffer.id == offer_id))


@router.patch("/{offer_id}/visibility")
async def toggle_offer_visibility(offer_id: str, payload: OfferVisibilityUpdate, db: Session = Depends(get_db)):
    """Active/désactive visible_site."""
    offer = db.scalar(select(JobOffer).where(JobOffer.id == offer_id))
    if not offer:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    offer.visible_site = payload.visible_site
    db.commit()
    return {"message": "Visibilité mise à jour"}


@router.patch("/{offer_id}/status")
async def update_offer_status(offer_id: str, payload: OfferStatusUpdate, db: Session = Depends(get_db)):
    """Change le statut (active, expired, filled, archived)."""
    offer = db.scalar(select(JobOffer).where(JobOffer.id == offer_id))
    if not offer:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    offer.status = JobOfferStatus(payload.status)
    db.commit()
    return {"message": "Statut mis à jour"}


@router.delete("/{offer_id}", status_code=204)
async def delete_offer(offer_id: str, db: Session = Depends(get_db)):
    """Suppression logique (soft delete)."""
    offer = db.scalar(select(JobOffer).where(JobOffer.id == offer_id))
    if not offer:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    offer.deleted_at = datetime.utcnow()
    db.commit()


@router.post("/bulk-status")
async def bulk_update_status(payload: OfferBulkStatusUpdate, db: Session = Depends(get_db)):
    """Changement de statut en masse (ex: expirer les offres > 30j)."""
    stmt = (
        update(JobOffer)
        .where(JobOffer.id.in_(payload.offer_ids))
        .values(status=JobOfferStatus(payload.status))
    )
    result = db.execute(stmt)
    db.commit()
    return {"message": f"{result.rowcount} offres mises à jour"}