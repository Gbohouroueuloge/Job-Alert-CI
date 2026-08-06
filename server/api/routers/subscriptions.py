from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.subscriptions import SubscriberCreate, SubscriberRead
from services.subscriptions import create_subscriber

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("", response_model=SubscriberRead, status_code=status.HTTP_201_CREATED)
def subscribe(payload: SubscriberCreate, db: Session = Depends(get_db)):
    try:
        return create_subscriber(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cet email est deja inscrit") from exc
