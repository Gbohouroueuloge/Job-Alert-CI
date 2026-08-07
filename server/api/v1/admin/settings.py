from fastapi import APIRouter

router = APIRouter(prefix="/api/admin/settings", tags=["admin-settings"])


@router.get("")
async def list_settings():
    """Tous les paramètres du site."""
    pass


@router.get("/{key}")
async def get_setting(key: str):
    pass


@router.put("/{key}")
async def update_setting(key: str, payload: "SettingUpdate"):
    """Met à jour un paramètre (heure d'envoi, textes, coordonnées…)."""
    pass


@router.post("/bulk")
async def bulk_update_settings(payload: "SettingsBulkUpdate"):
    """Mise à jour de plusieurs paramètres en une fois."""
    pass