from __future__ import annotations

import hashlib
import re
import unicodedata


def normalize_text(value: str | None) -> str:
    """Normalise une chaine pour les recherches et les unicites."""

    if not value:
        return ""
    text = unicodedata.normalize("NFKD", value)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"[^a-zA-Z0-9]+", " ", text).strip().lower()
    return re.sub(r"\s+", " ", text)


def slugify(value: str) -> str:
    slug = normalize_text(value).replace(" ", "-")
    return slug or "element"


def hash_offer(*parts: str | None) -> str:
    """Hash de dedoublonnage stable entre scraping, imports et saisie admin."""

    raw = "|".join(normalize_text(part) for part in parts if part)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
