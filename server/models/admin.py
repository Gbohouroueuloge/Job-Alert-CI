from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from models.enums import AdminAction, AdminRole
from models.types import enum_column

"""Back-office: comptes, audit et parametres editables."""


class Administrator(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "administrators"

    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(180), nullable=False)
    role: Mapped[AdminRole] = mapped_column(enum_column(AdminRole), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    offers: Mapped[list["JobOffer"]] = relationship(back_populates="admin")
    content_pages: Mapped[list["ContentPage"]] = relationship(back_populates="updated_by_admin")


class AdminActionLog(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "admin_action_logs"

    admin_id: Mapped[str] = mapped_column(ForeignKey("administrators.id", ondelete="CASCADE"), nullable=False, index=True)
    action: Mapped[AdminAction] = mapped_column(enum_column(AdminAction), nullable=False)
    target_table: Mapped[str] = mapped_column(String(100), nullable=False)
    target_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    admin: Mapped["Administrator"] = relationship()


class SiteSetting(Base):
    __tablename__ = "site_settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    updated_by_admin_id: Mapped[str | None] = mapped_column(ForeignKey("administrators.id", ondelete="SET NULL"), nullable=True)
