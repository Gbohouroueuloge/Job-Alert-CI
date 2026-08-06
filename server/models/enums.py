from enum import StrEnum

"""Enums metier partages par ORM et les schemas API.

Garder ces statuts dans un seul fichier évite les divergences entre
la base, les routes FastAPI, les jobs de scraping et les futurs formulaires
admin.
"""


class SourceStatus(StrEnum):
    ACTIVE = "active"
    PAUSED = "paused"
    DISABLED = "disabled"


class ScrapeRunStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    PARTIAL_FAILURE = "partial_failure"
    FAILED = "failed"


class JobOfferStatus(StrEnum):
    ACTIVE = "active"
    EXPIRED = "expired"
    ARCHIVED = "archived"
    DUPLICATE = "duplicate"
    HIDDEN = "hidden"


class IngestionAction(StrEnum):
    INSERTED = "inserted"
    UPDATED = "updated"
    DUPLICATE = "duplicate"
    SKIPPED = "skipped"
    FAILED = "failed"


class SubscriberStatus(StrEnum):
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    UNSUBSCRIBED = "unsubscribed"
    BOUNCED = "bounced"
    DELETED = "deleted"


class TokenPurpose(StrEnum):
    CONFIRM_EMAIL = "confirm_email"
    MANAGE_ALERT = "manage_alert"
    UNSUBSCRIBE = "unsubscribe"


class DigestStatus(StrEnum):
    QUEUED = "queued"
    SKIPPED_EMPTY = "skipped_empty"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"
    CANCELLED = "cancelled"


class EmailAttemptStatus(StrEnum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class ContentStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ContentType(StrEnum):
    ARTICLE = "article"
    FAQ = "faq"
    STATIC_PAGE = "static_page"
    LEGAL_PAGE = "legal_page"


class ContactMessageStatus(StrEnum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    REPLIED = "replied"
    CLOSED = "closed"
    SPAM = "spam"
