from __future__ import annotations

from fastapi import APIRouter, Depends

from api.deps import require_admin_api_key
from api.v1.public import articles, contact, filieres, offers, referentials, sources, stats, subscriptions
from api.v1.admin import (
    admins,
    auth,
    content,
    dashboard,
    logs,
    offers as admin_offers,
    referentials as admin_referentials,
    scraping,
    sending,
    settings,
    subscribers,
)

api_router = APIRouter()

# ─── Routes publiques ────────────────────────────────────
api_router.include_router(referentials.router)
api_router.include_router(offers.router)
api_router.include_router(filieres.router)
api_router.include_router(sources.router)
api_router.include_router(articles.router)
api_router.include_router(subscriptions.router)
api_router.include_router(contact.router)
api_router.include_router(stats.router)

# ─── Routes admin protégées ──────────────────────────────
admin_dependencies = [Depends(require_admin_api_key)]
api_router.include_router(auth.router, dependencies=admin_dependencies)
api_router.include_router(dashboard.router, dependencies=admin_dependencies)
api_router.include_router(admin_offers.router, dependencies=admin_dependencies)
api_router.include_router(subscribers.router, dependencies=admin_dependencies)
api_router.include_router(admin_referentials.router, dependencies=admin_dependencies)
api_router.include_router(content.router, dependencies=admin_dependencies)
api_router.include_router(scraping.router, dependencies=admin_dependencies)
api_router.include_router(sending.router, dependencies=admin_dependencies)
api_router.include_router(admins.router, dependencies=admin_dependencies)
api_router.include_router(logs.router, dependencies=admin_dependencies)
api_router.include_router(settings.router, dependencies=admin_dependencies)
