from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from core.config import get_settings
from models import ContractType, Filiere, Subscriber, SubscriberContractPreference, SubscriberFiliere, SubscriberStatus
from schemas.subscriptions import SubscriberCreate


def create_subscriber(db: Session, payload: SubscriberCreate) -> Subscriber:
    """Cree un abonnement dans une transaction courte.

    Pourquoi : la regle metier "1 a 3 filieres" doit etre verifiee cote
    application, car elle depend d'un nombre de lignes liees. On valide aussi
    que les ids recus existent avant d'ecrire les associations.
    """

    filiere_ids = list(dict.fromkeys(payload.filiere_ids))
    if not 1 <= len(filiere_ids) <= 3:
        raise ValueError("Choisissez entre 1 et 3 filieres")

    found_filieres = set(db.scalars(select(Filiere.id).where(Filiere.id.in_(filiere_ids))))
    missing_filieres = set(filiere_ids) - found_filieres
    if missing_filieres:
        raise ValueError("Une ou plusieurs filieres sont inconnues")

    contract_type_ids = list(dict.fromkeys(payload.contract_type_ids))
    if contract_type_ids:
        found_contracts = set(db.scalars(select(ContractType.id).where(ContractType.id.in_(contract_type_ids))))
        if set(contract_type_ids) - found_contracts:
            raise ValueError("Un ou plusieurs types de contrat sont inconnus")

    settings = get_settings()
    subscriber = Subscriber(
        email=payload.email,
        email_normalized=payload.email.lower(),
        full_name=payload.full_name,
        city=payload.city,
        status=SubscriberStatus.PENDING,
        timezone=settings.timezone,
        wants_career_tips=payload.wants_career_tips,
        experience_level_id=payload.experience_level_id,
        subscribed_at=datetime.now(UTC),
    )
    db.add(subscriber)
    db.flush()

    for index, filiere_id in enumerate(filiere_ids, start=1):
        db.add(SubscriberFiliere(subscriber_id=subscriber.id, filiere_id=filiere_id, priority=index))

    for contract_type_id in contract_type_ids:
        db.add(SubscriberContractPreference(subscriber_id=subscriber.id, contract_type_id=contract_type_id))

    db.commit()
    db.refresh(subscriber)
    return subscriber
