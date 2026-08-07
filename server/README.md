# JobAlert CI Server

Backend FastAPI pour JobAlert CI, fusionnant:

- le perimetre metier large de `ServerJobAlert` : offres, filieres, sources, contenu, admin, envois et scraping;
- la structure plus robuste de `ServerJobAlert2` : configuration centralisee, SQLAlchemy 2, services, schemas Pydantic et Alembic.

## Demarrage

```powershell
cd server
copy .env.example .env
alembic upgrade head
python -m scripts.seed
uvicorn main:app --reload
```

## PostgreSQL

La variable principale est `DATABASE_URL`:

```env
DATABASE_URL="postgresql+psycopg://jobalert_app:jobalert_password@localhost:5432/jobalert_ci"
```

## Routes publiques

- `GET /health`
- `GET /api/offers`
- `GET /api/offers/{id_ou_slug}`
- `GET /api/offers/stats`
- `GET /api/offers/stats/by-filiere`
- `GET /api/offers/stats/by-source`
- `GET /api/referentials/*`
- `POST /api/subscriptions`
- `POST /api/contact`

## Routes admin

Les routes `/api/admin/*` utilisent `X-Admin-Api-Key`. Definir `ADMIN_API_KEY`
dans `.env` avant usage.
