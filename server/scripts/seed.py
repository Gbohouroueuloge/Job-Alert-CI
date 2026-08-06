from core.config import get_settings
from db.session import session_scope
from models import ContractType, EducationLevel, ExperienceLevel, Filiere, Location, Source

SOURCES = [
    {"code": "emploidakar", "name": "EmploiDakar CI", "slug": "emploidakar", "base_url": "https://www.emploidakar.com"},
    {"code": "goafrica", "name": "Go Africa Online", "slug": "goafrica", "base_url": "https://www.goafricaonline.com"},
    {"code": "novojob", "name": "Novojob Cote d'Ivoire", "slug": "novojob", "base_url": "https://www.novojob.com"},
    {"code": "linkedin", "name": "LinkedIn", "slug": "linkedin", "base_url": "https://www.linkedin.com",
     "anti_scraping_level": 5},
]

FILIERES = [
    {"code": "tech_dev", "label": "Tech & Developpement", "slug": "tech-dev", "sort_order": 10},
    {"code": "data_ia", "label": "Data & IA", "slug": "data-ia", "sort_order": 20},
    {"code": "marketing", "label": "Marketing & Communication", "slug": "marketing", "sort_order": 30},
    {"code": "finance", "label": "Finance & Comptabilite", "slug": "finance", "sort_order": 40},
    {"code": "rh", "label": "Ressources humaines", "slug": "rh", "sort_order": 50},
    {"code": "btp", "label": "BTP & Industrie", "slug": "btp-industrie", "sort_order": 60},
    {"code": "commerce", "label": "Commerce & Vente", "slug": "commerce-vente", "sort_order": 70},
    {"code": "support", "label": "Support & Administration", "slug": "support-administration", "sort_order": 80},
]

CONTRACT_TYPES = [
    {"code": "cdi", "label": "CDI", "sort_order": 10},
    {"code": "cdd", "label": "CDD", "sort_order": 20},
    {"code": "stage", "label": "Stage", "sort_order": 30},
    {"code": "freelance", "label": "Freelance", "sort_order": 40},
]

EXPERIENCE_LEVELS = [
    {"code": "junior", "label": "Junior", "min_years": 0, "max_years": 2, "sort_order": 10},
    {"code": "confirme", "label": "Confirme", "min_years": 3, "max_years": 5, "sort_order": 20},
    {"code": "senior", "label": "Senior", "min_years": 6, "max_years": None, "sort_order": 30},
]

EDUCATION_LEVELS = [
    {"code": "bac", "label": "Bac", "rank": 1, "sort_order": 10},
    {"code": "bac_2", "label": "Bac+2", "rank": 2, "sort_order": 20},
    {"code": "bac_3", "label": "Bac+3", "rank": 3, "sort_order": 30},
    {"code": "bac_5", "label": "Bac+5", "rank": 5, "sort_order": 40},
]

LOCATIONS = [
    {"city": "Abidjan", "label": "Abidjan", "normalized_label": "abidjan"},
    {"city": "Yamoussoukro", "label": "Yamoussoukro", "normalized_label": "yamoussoukro"},
    {"city": "Remote", "label": "Remote", "normalized_label": "remote", "is_remote": True},
]


def upsert_by_code(db, model, rows):
    for row in rows:
        obj = db.query(model).filter_by(code=row["code"]).one_or_none()
        if obj is None:
            db.add(model(**row))
        else:
            for key, value in row.items():
                setattr(obj, key, value)


def seed_locations(db):
    for row in LOCATIONS:
        obj = db.query(Location).filter_by(normalized_label=row["normalized_label"]).one_or_none()
        if obj is None:
            db.add(Location(**row))
        else:
            for key, value in row.items():
                setattr(obj, key, value)


if __name__ == "__main__":
    # Seed idempotent : on peut le relancer sans dupliquer les referentiels.
    settings = get_settings()
    print(f"Base cible: {settings.database_url}")
    with session_scope() as db:
        upsert_by_code(db, Source, SOURCES)
        upsert_by_code(db, Filiere, FILIERES)
        upsert_by_code(db, ContractType, CONTRACT_TYPES)
        upsert_by_code(db, ExperienceLevel, EXPERIENCE_LEVELS)
        upsert_by_code(db, EducationLevel, EDUCATION_LEVELS)
        seed_locations(db)
    print("Référentiels insérés ou mis a jour.")
