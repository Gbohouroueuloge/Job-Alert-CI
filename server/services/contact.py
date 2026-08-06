from hashlib import sha256

from fastapi import Request
from sqlalchemy.orm import Session

from models import ContactMessage, ContactMessageStatus
from schemas.content import ContactMessageCreate


def _hash_optional(value: str | None) -> str | None:
    if not value:
        return None
    return sha256(value.encode("utf-8")).hexdigest()


def create_contact_message(db: Session, payload: ContactMessageCreate, request: Request) -> ContactMessage:
    """Enregistre un message de contact avec un minimum de metadata.

    Pourquoi : on garde un hash d'IP, pas l'IP brute, pour aider au diagnostic
    et a l'anti-spam sans stocker inutilement une donnee personnelle lisible.
    """

    message = ContactMessage(
        full_name=payload.full_name.strip(),
        email=payload.email,
        subject_code=payload.subject_code.strip(),
        subject_label=payload.subject_label.strip(),
        message=payload.message.strip(),
        status=ContactMessageStatus.NEW,
        ip_hash=_hash_optional(request.client.host if request.client else None),
        user_agent=request.headers.get("user-agent"),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
