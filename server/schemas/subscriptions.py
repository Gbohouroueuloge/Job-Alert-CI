from datetime import datetime

from pydantic import Field, field_validator

from schemas.base import ORMModel


class SubscriberCreate(ORMModel):
    email: str = Field(max_length=320)
    full_name: str | None = Field(default=None, max_length=180)
    city: str | None = Field(default=None, max_length=120)
    filiere_ids: list[str] = Field(min_length=1, max_length=3)
    contract_type_ids: list[str] = Field(default_factory=list)
    experience_level_id: str | None = None
    wants_career_tips: bool = True

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or "." not in normalized.rsplit("@", 1)[-1]:
            raise ValueError("Email invalide")
        return normalized


class SubscriberRead(ORMModel):
    id: str
    email: str
    full_name: str | None = None
    city: str | None = None
    status: str
    wants_career_tips: bool
    subscribed_at: datetime
