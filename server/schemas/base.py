from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    """Base Pydantic pour exposer les modeles SQLAlchemy."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TimestampRead(ORMModel):
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PageParams(BaseModel):
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
