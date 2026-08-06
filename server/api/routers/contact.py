from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.content import ContactMessageCreate, ContactMessageRead
from services.contact import create_contact_message

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    return create_contact_message(db, payload, request)
