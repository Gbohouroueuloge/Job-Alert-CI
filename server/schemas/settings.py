from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class SiteSettingRead(BaseModel):
    key: str
    value: str
    description: str | None = None
    updated_at: datetime


class SettingUpdate(BaseModel):
    value: str = Field(min_length=0, max_length=10000)
    description: str | None = Field(default=None, max_length=500)


class SettingsBulkUpdate(BaseModel):
    settings: dict[str, str] = Field(
        min_length=1,
        description="Dictionnaire clé → valeur des paramètres à mettre à jour.",
    )
