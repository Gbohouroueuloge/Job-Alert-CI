from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from models import (
    Company,
    ContractType,
    EducationLevel,
    ExperienceLevel,
    Filiere,
    JobOffer,
    JobOfferDetail,
    JobOfferOrigin,
    Location,
    Source,
)
from schemas.offers import OfferCreate
from services.normalization import hash_offer, normalize_text, slugify


def _get_required(db: Session, model, field_name: str, value: str):
    item = db.scalar(select(model).where(getattr(model, field_name) == value))
    if item is None:
        raise ValueError(f"{model.__name__} introuvable: {value}")
    return item


def _get_optional_by_code(db: Session, model, value: str | None):
    if not value:
        return None
    return db.scalar(select(model).where(model.code == value))


def _get_or_create_company(db: Session, name: str) -> Company:
    normalized = normalize_text(name)
    company = db.scalar(select(Company).where(Company.normalized_name == normalized))
    if company is not None:
        return company
    company = Company(name=name.strip(), normalized_name=normalized, slug=slugify(name))
    db.add(company)
    db.flush()
    return company


def _get_or_create_location(db: Session, label: str | None) -> Location | None:
    if not label:
        return None
    normalized = normalize_text(label)
    location = db.scalar(select(Location).where(Location.normalized_label == normalized))
    if location is not None:
        return location
    location = Location(city=label.strip(), label=label.strip(), normalized_label=normalized)
    db.add(location)
    db.flush()
    return location


def create_offer(db: Session, payload: OfferCreate, admin_id: str | None = None) -> JobOffer:
    """Cree une offre manuelle avec les memes protections que le scraping."""

    source = _get_required(db, Source, "code", payload.source_code)
    company = _get_or_create_company(db, payload.company_name)
    filiere = _get_optional_by_code(db, Filiere, payload.filiere_code)
    location = _get_or_create_location(db, payload.location_label)
    contract_type = _get_optional_by_code(db, ContractType, payload.contract_type_code)
    experience_level = _get_optional_by_code(db, ExperienceLevel, payload.experience_level_code)
    education_level = _get_optional_by_code(db, EducationLevel, payload.education_level_code)
    now = datetime.now(timezone.utc)
    unique_hash = hash_offer(payload.title, payload.company_name, payload.source_url, payload.source_reference)

    existing = db.scalar(select(JobOffer).where(JobOffer.hash_unique == unique_hash))
    if existing is not None:
        return existing

    offer = JobOffer(
        title=payload.title.strip(),
        normalized_title=normalize_text(payload.title),
        slug=slugify(f"{payload.title}-{company.name}"),
        company_id=company.id,
        source_id=source.id,
        location_id=location.id if location else None,
        primary_filiere_id=filiere.id if filiere else None,
        contract_type_id=contract_type.id if contract_type else None,
        experience_level_id=experience_level.id if experience_level else None,
        education_level_id=education_level.id if education_level else None,
        admin_id=admin_id,
        origin=JobOfferOrigin.MANUAL,
        source_url=payload.source_url,
        canonical_url=payload.canonical_url,
        source_reference=payload.source_reference,
        hash_unique=unique_hash,
        published_at=payload.published_at,
        collected_at=now,
        first_seen_at=now,
        expires_at=payload.expires_at,
        application_deadline_at=payload.application_deadline_at,
    )
    offer.detail = JobOfferDetail(
        intro=payload.intro,
        missions=payload.missions,
        profile_requirements=payload.profile_requirements,
        benefits=payload.benefits,
        tags=payload.tags,
        is_manual=True,
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer
