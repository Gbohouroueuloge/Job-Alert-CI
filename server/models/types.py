from enum import StrEnum

from sqlalchemy import Enum


def enum_column(enum_cls: type[StrEnum]) -> Enum:
    """Colonne enum portable PostgreSQL/SQLite.

    Pourquoi : on stocke les valeurs texte ('active', 'failed', etc.) avec une
    contrainte CHECK au lieu d'un ENUM natif PostgreSQL. C'est plus simple à
    faire évoluer par migration quand le produit ajoute un nouveau statut.
    """

    return Enum(
        enum_cls,
        native_enum=False,
        validate_strings=True,
        values_callable=lambda members: [member.value for member in members],
        create_constraint=True,
        name=f"{enum_cls.__name__.lower()}_values",
        length=60,
    )
