# Backend JobAlert CI

Ce backend fusionne intelligemment les deux archives fournies :

- `serverFastApi.zip` sert de base applicative : modeles modernes en UUID, soft delete, domaines separes, schemas plus
  detailles pour les offres, abonnements, scraping, emails et contenu.
- `jobalert_ci_db.zip` apporte les choix robustes de production : convention de nommage des contraintes, session
  SQLAlchemy stable, support Alembic, seed idempotent et logique de configuration orientee environnement.

## Pourquoi cette structure

- `core/` centralise la configuration pour eviter les secrets et options caches dans le code metier.
- `db/` gere l'engine, le pool et les sessions courtes par requete FastAPI.
- `models/` contient la verite SQLAlchemy du domaine.
- `schemas/` definit les contrats publics de l'API, separes des tables.
- `services/` porte les regles metier transactionnelles comme l'inscription.
- `api/routers/` decoupe les endpoints par domaine pour garder `main.py` lisible.
- `migrations/` prepare Alembic pour les evolutions de schema en production.

## Demarrage local

```powershell
cd C:\repos\Job-Alert-CI\server
.\.venv\Scripts\python.exe -m scripts.init_db
.\.venv\Scripts\python.exe -m scripts.seed
.\.venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000
```

API locale : http://127.0.0.1:8000

Documentation OpenAPI : http://127.0.0.1:8000/docs

## Production

En production, definir `DATABASE_URL` ou les variables `DB_*` vers PostgreSQL, puis utiliser Alembic plutot que
`AUTO_CREATE_TABLES`.
