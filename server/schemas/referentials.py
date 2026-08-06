from schemas.base import ORMModel


class SourceRead(ORMModel):
    id: str
    code: str
    name: str
    slug: str
    base_url: str
    logo_path: str | None = None
    color_hex: str | None = None
    status: str
    priority: int


class FiliereRead(ORMModel):
    id: str
    code: str
    label: str
    slug: str
    hue: str | None = None
    tagline: str | None = None
    description: str | None = None
    sort_order: int


class ContractTypeRead(ORMModel):
    id: str
    code: str
    label: str
    sort_order: int


class ExperienceLevelRead(ORMModel):
    id: str
    code: str
    label: str
    min_years: int | None = None
    max_years: int | None = None
    sort_order: int


class EducationLevelRead(ORMModel):
    id: str
    code: str
    label: str
    rank: int | None = None
    sort_order: int


class LocationRead(ORMModel):
    id: str
    country_code: str
    city: str
    district: str | None = None
    label: str
    is_remote: bool
