from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from api.deps import get_db
from models import ContractType, EducationLevel, ExperienceLevel, Filiere, Location, Source
from schemas.referentials import (
    ContractTypeRead,
    EducationLevelRead,
    ExperienceLevelRead,
    FiliereRead,
    LocationRead,
    SourceRead,
)

router = APIRouter(prefix="/referentials", tags=["referentials"])


@router.get("/sources", response_model=list[SourceRead])
def list_sources(db: Session = Depends(get_db)) -> list[Source]:
    return list(db.scalars(
        select(Source).order_by(Source.priority, Source.name)
    ))


@router.get("/filieres", response_model=list[FiliereRead])
def list_filieres(db: Session = Depends(get_db)) -> list[Filiere]:
    return list(
        db.scalars(
            select(Filiere).where(Filiere.is_active.is_(True))
            .order_by(Filiere.sort_order, Filiere.label)
        ))


@router.get("/contract-types", response_model=list[ContractTypeRead])
def list_contract_types(db: Session = Depends(get_db)) -> list[ContractType]:
    return list(
        db.scalars(
            select(ContractType).where(ContractType.is_active.is_(True))
            .order_by(ContractType.sort_order)
        ))


@router.get("/experience-levels", response_model=list[ExperienceLevelRead])
def list_experience_levels(db: Session = Depends(get_db)) -> list[ExperienceLevel]:
    return list(db.scalars(
        select(ExperienceLevel).where(ExperienceLevel.is_active.is_(True))
        .order_by(ExperienceLevel.sort_order)
    ))


@router.get("/education-levels", response_model=list[EducationLevelRead])
def list_education_levels(db: Session = Depends(get_db)) -> list[EducationLevel]:
    return list(db.scalars(
        select(EducationLevel).where(EducationLevel.is_active.is_(True))
        .order_by(EducationLevel.sort_order)
    ))


@router.get("/locations", response_model=list[LocationRead])
def list_locations(db: Session = Depends(get_db)) -> list[Location]:
    return list(db.scalars(
        select(Location).where(Location.is_active.is_(True))
        .order_by(Location.label)
    ))
