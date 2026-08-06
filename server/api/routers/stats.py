from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from api.deps import get_db
from models import Filiere, JobOffer, JobOfferStatus, Source
from schemas.offer_stats import OfferStatsBucketRead, OfferStatsSummaryRead

router = APIRouter(prefix="/offers/stats", tags=["offers"])

OfferDateField = Literal["first_seen_at", "published_at", "created_at"]


def _resolve_new_since(
        new_since_at: datetime | None,
        new_since_days: int,
) -> datetime:
    if new_since_at is not None:
        return new_since_at
    return datetime.now(timezone.utc) - timedelta(days=new_since_days)


def _base_offer_filters(
        *,
        filiere_id: str | None,
        source_id: str | None,
        visible_only: bool,
        active_only: bool,
) -> list:
    filters = [JobOffer.deleted_at.is_(None)]
    if visible_only:
        filters.append(JobOffer.visible_site.is_(True))
    if active_only:
        filters.append(JobOffer.status == JobOfferStatus.ACTIVE)
    if filiere_id is not None:
        filters.append(JobOffer.primary_filiere_id == filiere_id)
    if source_id is not None:
        filters.append(JobOffer.source_id == source_id)
    return filters


def _new_offer_expr(date_field: OfferDateField, new_since_at: datetime):
    offer_date_column = getattr(JobOffer, date_field)
    return func.coalesce(func.sum(case((offer_date_column >= new_since_at, 1), else_=0)), 0)


def _summary_payload(
        db: Session,
        *,
        filiere_id: str | None,
        source_id: str | None,
        visible_only: bool,
        active_only: bool,
        new_since_at: datetime,
        new_date_field: OfferDateField,
) -> OfferStatsSummaryRead:
    filters = _base_offer_filters(
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
    )
    stmt = select(
        func.count(JobOffer.id),
        _new_offer_expr(new_date_field, new_since_at),
    ).where(*filters)
    total_offers, new_offers = db.execute(stmt).one()
    return OfferStatsSummaryRead(total_offers=total_offers, new_offers=new_offers)


def _filiere_breakdown(
        db: Session,
        *,
        filiere_id: str | None,
        source_id: str | None,
        visible_only: bool,
        active_only: bool,
        new_since_at: datetime,
        new_date_field: OfferDateField,
        limit: int,
) -> list[OfferStatsBucketRead]:
    filters = _base_offer_filters(
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
    )
    new_offers_expr = _new_offer_expr(new_date_field, new_since_at)
    stmt = (
        select(
            Filiere.id,
            Filiere.code,
            Filiere.label,
            func.count(JobOffer.id).label("total_offers"),
            new_offers_expr.label("new_offers"),
        )
        .join(JobOffer, JobOffer.primary_filiere_id == Filiere.id)
        .where(*filters, JobOffer.primary_filiere_id.is_not(None))
        .group_by(Filiere.id, Filiere.code, Filiere.label, Filiere.sort_order)
        .order_by(func.count(JobOffer.id).desc(), Filiere.sort_order, Filiere.label)
        .limit(limit)
    )
    rows = db.execute(stmt).all()
    return [
        OfferStatsBucketRead(
            id=row.id,
            code=row.code,
            label=row.label,
            total_offers=row.total_offers,
            new_offers=row.new_offers,
        )
        for row in rows
    ]


def _source_breakdown(
        db: Session,
        *,
        filiere_id: str | None,
        source_id: str | None,
        visible_only: bool,
        active_only: bool,
        new_since_at: datetime,
        new_date_field: OfferDateField,
        limit: int,
) -> list[OfferStatsBucketRead]:
    filters = _base_offer_filters(
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
    )
    new_offers_expr = _new_offer_expr(new_date_field, new_since_at)
    stmt = (
        select(
            Source.id,
            Source.code,
            Source.name.label("label"),
            func.count(JobOffer.id).label("total_offers"),
            new_offers_expr.label("new_offers"),
        )
        .join(JobOffer, JobOffer.source_id == Source.id)
        .where(*filters)
        .group_by(Source.id, Source.code, Source.name, Source.priority)
        .order_by(func.count(JobOffer.id).desc(), Source.priority, Source.name)
        .limit(limit)
    )
    rows = db.execute(stmt).all()
    return [
        OfferStatsBucketRead(
            id=row.id,
            code=row.code,
            label=row.label,
            total_offers=row.total_offers,
            new_offers=row.new_offers,
        )
        for row in rows
    ]


@router.get("", response_model=OfferStatsSummaryRead)
def get_offer_stats(
        db: Session = Depends(get_db),
        filiere_id: str | None = Query(default=None),
        source_id: str | None = Query(default=None),
        new_since_at: datetime | None = Query(default=None),
        new_since_days: int = Query(default=7, ge=1, le=3650),
        new_date_field: OfferDateField = Query(default="first_seen_at"),
        visible_only: bool = Query(default=True),
        active_only: bool = Query(default=True),
) -> OfferStatsSummaryRead:
    """Compteurs rapides des offres.

    `new_since_at` permet de forcer une date précise, sinon `new_since_days`
    définit la fenêtre des nouvelles offres. Le filtrage par filière/source
    réduit le volume de données scanné et accélère la requête.
    """

    resolved_new_since = _resolve_new_since(new_since_at, new_since_days)
    return _summary_payload(
        db,
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
        new_since_at=resolved_new_since,
        new_date_field=new_date_field,
    )


@router.get("/by-filiere", response_model=list[OfferStatsBucketRead])
def get_offer_stats_by_filiere(
        db: Session = Depends(get_db),
        filiere_id: str | None = Query(default=None),
        source_id: str | None = Query(default=None),
        limit: int = Query(default=50, ge=1, le=500),
        new_since_at: datetime | None = Query(default=None),
        new_since_days: int = Query(default=7, ge=1, le=3650),
        new_date_field: OfferDateField = Query(default="first_seen_at"),
        visible_only: bool = Query(default=True),
        active_only: bool = Query(default=True),
) -> list[OfferStatsBucketRead]:
    resolved_new_since = _resolve_new_since(new_since_at, new_since_days)
    return _filiere_breakdown(
        db,
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
        new_since_at=resolved_new_since,
        new_date_field=new_date_field,
        limit=limit,
    )


@router.get("/by-source", response_model=list[OfferStatsBucketRead])
def get_offer_stats_by_source(
        db: Session = Depends(get_db),
        filiere_id: str | None = Query(default=None),
        source_id: str | None = Query(default=None),
        limit: int = Query(default=50, ge=1, le=500),
        new_since_at: datetime | None = Query(default=None),
        new_since_days: int = Query(default=7, ge=1, le=3650),
        new_date_field: OfferDateField = Query(default="first_seen_at"),
        visible_only: bool = Query(default=True),
        active_only: bool = Query(default=True),
) -> list[OfferStatsBucketRead]:
    resolved_new_since = _resolve_new_since(new_since_at, new_since_days)
    return _source_breakdown(
        db,
        filiere_id=filiere_id,
        source_id=source_id,
        visible_only=visible_only,
        active_only=active_only,
        new_since_at=resolved_new_since,
        new_date_field=new_date_field,
        limit=limit,
    )
