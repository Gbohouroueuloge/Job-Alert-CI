from datetime import datetime

from schemas.base import ORMModel
from schemas.referentials import FiliereRead, LocationRead, SourceRead


class CompanyRead(ORMModel):
    id: str
    name: str
    slug: str | None = None
    website_url: str | None = None
    logo_url: str | None = None


class JobOfferDetailRead(ORMModel):
    intro: str | None = None
    missions: list[str] | None = None
    profile_requirements: list[str] | None = None
    benefits: list[str] | None = None
    tags: list[str] | None = None
    source_text: str | None = None


class JobOfferRead(ORMModel):
    id: str
    public_id: int | None = None
    title: str
    slug: str | None = None
    status: str
    source_url: str
    canonical_url: str | None = None
    location_raw: str | None = None
    salary_raw: str | None = None
    published_at: datetime | None = None
    collected_at: datetime
    expires_at: datetime | None = None
    application_deadline_at: datetime | None = None
    view_count: int
    save_count: int
    company: CompanyRead
    source: SourceRead
    location: LocationRead | None = None
    primary_filiere: FiliereRead | None = None
    detail: JobOfferDetailRead | None = None
