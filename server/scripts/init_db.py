from core.config import get_settings
from db.session import init_db

if __name__ == "__main__":
    # Utilitaire dev uniquement : en production, utiliser Alembic pour garder
    # des migrations relisibles, versionnées et réversibles.
    settings = get_settings()
    print(f"Base cible: {settings.database_url}")
    init_db()
    print("Tables créées avec succès.")
