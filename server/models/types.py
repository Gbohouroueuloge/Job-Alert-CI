from enum import StrEnum

from sqlalchemy import Enum


def enum_column(enum_cls: type[StrEnum]) -> Enum:
    """Colonne enum evolutive.

    On stocke les valeurs texte avec une contrainte CHECK plutot qu'un ENUM
    PostgreSQL natif. Ajouter un statut devient une migration simple.
    """

    return Enum(
        enum_cls,
        native_enum=False,
        validate_strings=True,
        values_callable=lambda members: [member.value for member in members],
        create_constraint=True,
        name=f"{enum_cls.__name__.lower()}_values",
        length=80,
    )
