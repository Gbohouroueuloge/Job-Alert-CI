from datetime import datetime

from pydantic import Field, field_validator

from schemas.base import ORMModel


class ContactMessageCreate(ORMModel):
    full_name: str = Field(min_length=2, max_length=180)
    email: str = Field(max_length=320)
    subject_code: str = Field(min_length=2, max_length=80)
    subject_label: str = Field(min_length=2, max_length=180)
    message: str = Field(min_length=10)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or "." not in normalized.rsplit("@", 1)[-1]:
            raise ValueError("Email invalide")
        return normalized


class ContactMessageRead(ORMModel):
    id: str
    full_name: str
    email: str
    subject_code: str
    subject_label: str
    message: str
    status: str
    created_at: datetime
