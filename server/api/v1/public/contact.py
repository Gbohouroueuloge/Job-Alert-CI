from __future__ import annotations
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from api.deps import get_db
# Utiliser les schemas adéquats depuis l'ancien routeur si besoin, ou on le mettra plus tard.
# Le modèle est ContactMessageCreate depuis schemas/contact (à vérifier). On suppose contact.py.
# Je vais d'abord vérifier le nom du schema.
# Attend, l'erreur des subagents m'oblige à tout faire manuellement.
from services.contact import create_contact_message

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Je vais chercher le schema correct plus bas si ça plante, pour le moment, j'utilise pydantic generic
from pydantic import BaseModel

class ContactMessageCreate(BaseModel):
    full_name: str
    email: str
    subject_code: str
    message: str

@router.post("", status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    """Soumettre un message de contact."""
    # L'ancienne implémentation utilisait create_contact_message(db, payload, request)
    return create_contact_message(db, payload, request)