from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from schemas.base import TimestampRead


class AdminActionLogRead(BaseModel):
    id: str
    admin_id: str
    action: str
    target_table: str
    target_id: str | None = None
    details: dict | None = None
    created_at: datetime


class ContactStatusUpdate(BaseModel):
    status: Literal["new", "read", "replied", "archived"]


class ContactMessageAdminRead(TimestampRead):
    id: str
    full_name: str
    email: str
    subject_code: str
    subject_label: str
    message: str
    status: str
    ip_hash: str | None = None
    user_agent: str | None = None
    replied_at: datetime | None = None
