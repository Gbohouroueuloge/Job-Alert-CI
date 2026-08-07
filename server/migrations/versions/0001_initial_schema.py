"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-07
"""

from typing import Sequence, Union

from alembic import op

from db.base import Base
import models  # noqa: F401

revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration initiale: on cree toutes les tables declarees par les modeles.
    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    # Drop dans l'ordre inverse des dependances SQLAlchemy.
    Base.metadata.drop_all(bind=op.get_bind())
