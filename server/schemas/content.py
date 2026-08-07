from __future__ import annotations

from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator

from schemas.base import TimestampRead


class ContactMessageCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(validation_alias=AliasChoices("full_name", "nom"), min_length=2, max_length=180)
    email: str = Field(min_length=5, max_length=320)
    subject_code: str = Field(validation_alias=AliasChoices("subject_code", "sujet"), min_length=2, max_length=80)
    subject_label: str | None = Field(default=None, max_length=180)
    message: str = Field(min_length=20, max_length=2000)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip()
        if "@" not in cleaned or "." not in cleaned.rsplit("@", 1)[-1]:
            raise ValueError("Adresse email invalide")
        return cleaned


class ContactMessageRead(TimestampRead):
    id: str
    full_name: str
    email: str
    subject_code: str
    subject_label: str
    message: str
    status: str
    replied_at: datetime | None = None


class ContentPageRead(TimestampRead):
    id: str
    content_type: str
    slug: str
    title: str
    excerpt: str | None = None
    body: dict | list | None = None
    status: str
    seo_title: str | None = None
    seo_description: str | None = None
    keywords: list[str] | None = None
    published_at: datetime | None = None
