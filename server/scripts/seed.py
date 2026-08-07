from __future__ import annotations

from sqlalchemy import select

from db.session import session_scope
from models import ContractType, EducationLevel, ExperienceLevel, Filiere, FiliereKeyword, Source
from models.enums import SourceStatus
from services.normalization import normalize_text, slugify

SOURCES = [
    ("emploi-dakar", "EmploiDakar CI", "https://www.emploidakar.com", 10, "ED"),
    ("goafrica", "Go Africa Online", "https://www.goafricaonline.com", 20, "GA"),
    ("novojob", "Novojob", "https://www.novojob.com", 30, "NJ"),
    ("linkedin", "LinkedIn", "https://www.linkedin.com", 40, "in"),
]

FILIERES = [
    ("tech-dev", "Tech & Dev", "sky", ["developpeur", "python", "react", "data", "cloud"]),
    ("marketing-com", "Marketing & Communication", "fuchsia", ["marketing", "communication", "community manager"]),
    ("commercial-vente", "Commercial & Vente", "orange", ["commercial", "vente", "business developer"]),
    ("comptabilite-finance", "Comptabilite & Finance", "emerald", ["comptable", "finance", "audit"]),
    ("ressources-humaines", "Ressources Humaines", "violet", ["rh", "recrutement", "paie"]),
    ("btp-genie-civil", "BTP & Genie Civil", "amber", ["btp", "genie civil", "chantier"]),
    ("logistique-transport", "Logistique & Transport", "cyan", ["logistique", "transport", "supply chain"]),
    ("sante-medical", "Sante & Medical", "rose", ["sante", "medical", "infirmier"]),
    ("administration", "Administration", "slate", ["assistant", "administratif", "office"]),
    ("education-formation", "Education & Formation", "lime", ["enseignant", "formation", "pedagogie"]),
    ("hotellerie-restauration", "Hotellerie & Restauration", "red", ["hotel", "restaurant", "cuisine"]),
    ("agriculture-agrobusiness", "Agriculture & Agrobusiness", "green", ["agriculture", "agro", "elevage"]),
    ("securite-gardiennage", "Securite & Gardiennage", "zinc", ["securite", "gardiennage", "hse"]),
]

CONTRACTS = [("cdi", "CDI"), ("cdd", "CDD"), ("stage", "Stage"), ("mission", "Mission"), ("alternance", "Alternance")]
EXPERIENCES = [("debutant", "Debutant", 0, 1), ("1-3", "1-3 ans", 1, 3), ("3-5", "3-5 ans", 3, 5), ("5-plus", "5 ans+", 5, None)]
EDUCATION = [("bac", "Bac", 1), ("bac-2", "Bac+2", 2), ("bac-3", "Bac+3", 3), ("bac-5", "Bac+5", 5), ("bac-8", "Bac+8", 8)]


def get_or_create(db, model, **values):
    item = db.scalar(select(model).where(model.code == values["code"]))
    if item is None:
        item = model(**values)
        db.add(item)
        db.flush()
    else:
        for key, value in values.items():
            setattr(item, key, value)
    return item


def seed() -> None:
    with session_scope() as db:
        for order, (code, name, base_url, priority, short_code) in enumerate(SOURCES, start=1):
            get_or_create(
                db,
                Source,
                code=code,
                name=name,
                slug=slugify(code),
                base_url=base_url,
                status=SourceStatus.ACTIVE,
                priority=priority,
                short_code=short_code,
                is_primary=order <= 3,
            )

        for order, (code, label, hue, keywords) in enumerate(FILIERES, start=1):
            filiere = get_or_create(
                db,
                Filiere,
                code=code,
                label=label,
                slug=slugify(code),
                hue=hue,
                sort_order=order,
                is_active=True,
            )
            for weight, keyword in enumerate(keywords, start=1):
                normalized = normalize_text(keyword)
                exists = db.scalar(
                    select(FiliereKeyword).where(
                        FiliereKeyword.filiere_id == filiere.id,
                        FiliereKeyword.normalized_keyword == normalized,
                    )
                )
                if exists is None:
                    db.add(
                        FiliereKeyword(
                            filiere_id=filiere.id,
                            keyword=keyword,
                            normalized_keyword=normalized,
                            weight=max(1, 100 - weight),
                        )
                    )

        for order, (code, label) in enumerate(CONTRACTS, start=1):
            get_or_create(db, ContractType, code=code, label=label, sort_order=order, is_active=True)

        for order, (code, label, min_years, max_years) in enumerate(EXPERIENCES, start=1):
            get_or_create(
                db,
                ExperienceLevel,
                code=code,
                label=label,
                min_years=min_years,
                max_years=max_years,
                sort_order=order,
                is_active=True,
            )

        for order, (code, label, rank) in enumerate(EDUCATION, start=1):
            get_or_create(db, EducationLevel, code=code, label=label, rank=rank, sort_order=order, is_active=True)


if __name__ == "__main__":
    seed()
    print("Referentiels de base inseres.")
