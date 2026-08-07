from __future__ import annotations

import hashlib

from fastapi import Request
from sqlalchemy.orm import Session

from models import ContactMessage, ContactMessageStatus
from schemas.content import ContactMessageCreate

SUBJECT_LABELS = {
    "service": "Question sur le service",
    "alerte": "Probleme avec mon alerte",
    "source": "Proposer une source",
    "partenariat": "Partenariat / presse",
    "autre": "Autre chose",
}


def _hash_optional(value: str | None) -> str | None:
    if not value:
        return None
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def create_contact_message(db: Session, payload: ContactMessageCreate, request: Request) -> ContactMessage:
    """Enregistre un message de contact avec quelques traces non sensibles."""

    subject_label = payload.subject_label or SUBJECT_LABELS.get(payload.subject_code, payload.subject_code)
    message = ContactMessage(
        full_name=payload.full_name.strip(),
        email=payload.email.strip().lower(),
        subject_code=payload.subject_code.strip(),
        subject_label=subject_label,
        message=payload.message.strip(),
        status=ContactMessageStatus.NEW,
        ip_hash=_hash_optional(request.client.host if request.client else None),
        user_agent=request.headers.get("user-agent"),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
