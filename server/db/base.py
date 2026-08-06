from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, MetaData, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column

# Alembic génère des migrations plus stables quand les contraintes
# ont des noms prévisibles. Sans ça, les noms auto-générés changent selon la DB
# et les diffs deviennent difficiles à rélire.
NAMING_CONVENTION = {
    "ix": "ix_%(table_name)s_%(column_0_N_name)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)

    @declared_attr.directive
    def __tablename__(self) -> str:
        """Nom de table par défaut en snake_case.

        Les nouveaux modèles gardent une convention uniforme
        meme si le développeur oublie `__tablename__`. Les modèles importants
        peuvent toujours le définir explicitement.
        """
        name = self.__name__
        chars: list[str] = []
        for index, char in enumerate(name):
            if char.isupper() and index > 0:
                chars.append("_")
            chars.append(char.lower())
        return "".join(chars)


class UUIDPrimaryKeyMixin:
    """Cle primaire UUID sous forme texte.

    Les UUID évitent d'exposer des ids incrémentaux prévisibles et
    restent faciles à déplacer entre services si le backend dèvient distribue.
    """

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )


class TimestampMixin:
    """Colonnes d'audit communes.

    Savoir quand une ligne a ete créée ou modifiée sans
    recoder ces champs dans chaque table metier.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class SoftDeleteMixin:
    """Suppression logique.

    On conserve l'historique utile aux emails, audits et tableaux de
    bord tout en cachant les lignes supprimées des vues publiques.
    """

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
