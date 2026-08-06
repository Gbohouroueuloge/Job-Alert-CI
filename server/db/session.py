from collections.abc import Generator, Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from core.config import get_settings

settings = get_settings()

engine_kwargs = {
    "echo": settings.database_echo,
    # pool_pre_ping évite de réutiliser une connexion morte apres une coupure
    # réseau ou un redémarrage PostgreSQL, cas frequent en hébergement manage.
    "pool_pre_ping": settings.db_pool_pre_ping,
    "future": True,
}

if settings.is_sqlite:
    # SQLite sert surtout au dev et aux tests. check_same_thread=False permet a
    # FastAPI de partager la connexion dans son modèle de threads.
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # plus resistant aux pics de charge et aux connexions stale en production.
    engine_kwargs["pool_size"] = settings.db_pool_size
    engine_kwargs["max_overflow"] = settings.db_max_overflow
    engine_kwargs["pool_timeout"] = settings.db_pool_timeout
    engine_kwargs["pool_recycle"] = settings.db_pool_recycle

engine = create_engine(settings.database_url, **engine_kwargs)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    """Dépendance FastAPI : une courte session par requete HTTP."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope() -> Iterator[Session]:
    """Transaction pour scripts autonomes.

    Les jobs de scraping, seed ou envoi email peuvent faire un
    commit automatique si tout va bien, et un rollback propre si une erreur
    survient au milieu du traitement.
    """

    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    from db.base import Base
    import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
