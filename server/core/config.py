from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
import os
from os import getenv
from pathlib import Path
from urllib.parse import quote_plus

DOTENV_PATH = Path(__file__).resolve().parents[1] / ".env"


def _load_dotenv_file() -> None:
    """Charge `server/.env` sans dependance externe.

    Pourquoi : `os.getenv()` ne lit pas un fichier `.env` tout seul. Sans ce
    chargement, les scripts et l'API peuvent tomber sur la mauvaise base,
    typiquement SQLite au lieu de PostgreSQL.
    """

    if not DOTENV_PATH.exists():
        return

    for raw_line in DOTENV_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if not key or key == "export":
            continue
        if key in os.environ:
            continue
        os.environ[key] = value.strip().strip('"').strip("'")


_load_dotenv_file()


def _bool_env(name: str, default: bool = False) -> bool:
    return getenv(name, str(default)).lower() in {"1", "true", "yes", "on"}


def _int_env(name: str, default: int) -> int:
    raw_value = getenv(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError as exc:
        raise ValueError(f"{name} doit être un entier valide") from exc


def _list_env(name: str, default: list[str]) -> list[str]:
    raw_value = getenv(name)
    if not raw_value:
        return default
    return [item.strip() for item in raw_value.split(",") if item.strip()]


def _database_url() -> str:
    """Construit le DSN sans dependence externe.

    `jobalert_ci_db` avait une configuration PostgreSQL solide,
    mais `serverFastApi` était plus pratique en local grâce à SQLite. Ici, on
    garde les deux : DATABASE_URL gagne toujours, puis les variables DB_* pour
    la production, puis SQLite pour lancer le serveur sans infrastructure.
    """

    explicit_url = getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url

    if getenv("DB_HOST") or getenv("DB_NAME") or getenv("DB_USER"):
        driver = getenv("DB_DRIVER", "postgresql+psycopg")
        user = quote_plus(getenv("DB_USER", "jobalert_app"))
        password = quote_plus(getenv("DB_PASSWORD", ""))
        host = getenv("DB_HOST", "localhost")
        port = getenv("DB_PORT", "5432")
        name = getenv("DB_NAME", "jobalert_ci")
        return f"{driver}://{user}:{password}@{host}:{port}/{name}"

    return "sqlite:///./jobalert2.db"


@dataclass(frozen=True)
class Settings:
    """Configuration centrale de l'API JobAlert CI.

    Pourquoi : regrouper les variables ici évite les valeurs cachées dans les
    routes ou les services. C'est plus robuste pour les secrets, les tests et
    les futurs déploiements multi-environnements.
    """

    app_name: str = field(default_factory=lambda: getenv("APP_NAME", "JobAlert CI API"))
    app_version: str = field(default_factory=lambda: getenv("APP_VERSION", "0.1.0"))
    environment: str = field(default_factory=lambda: getenv("APP_ENV", "development"))
    timezone: str = field(default_factory=lambda: getenv("APP_TIMEZONE", "Africa/Abidjan"))
    database_url: str = field(default_factory=_database_url)
    database_echo: bool = field(default_factory=lambda: _bool_env("DATABASE_ECHO", False))
    db_pool_size: int = field(default_factory=lambda: _int_env("DB_POOL_SIZE", 10))
    db_max_overflow: int = field(default_factory=lambda: _int_env("DB_MAX_OVERFLOW", 20))
    db_pool_timeout: int = field(default_factory=lambda: _int_env("DB_POOL_TIMEOUT", 30))
    db_pool_recycle: int = field(default_factory=lambda: _int_env("DB_POOL_RECYCLE", 1800))
    db_pool_pre_ping: bool = field(default_factory=lambda: _bool_env("DB_POOL_PRE_PING", True))
    cors_origins: list[str] = field(default_factory=lambda: _list_env("CORS_ORIGINS", ["http://localhost:5173"]))
    auto_create_tables: bool = field(default_factory=lambda: _bool_env("AUTO_CREATE_TABLES", False))
    email_from: str = field(default_factory=lambda: getenv("EMAIL_FROM", "JobAlert CI <bonjour@jobalert.ci>"))
    daily_collection_hour: int = field(default_factory=lambda: _int_env("DAILY_COLLECTION_HOUR", 6))
    daily_digest_hour: int = field(default_factory=lambda: _int_env("DAILY_DIGEST_HOUR", 8))

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def is_production(self) -> bool:
        return self.environment.lower() in {"prod", "production"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
