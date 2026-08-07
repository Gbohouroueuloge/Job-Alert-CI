from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api/admin/content", tags=["admin-content"])


# ─── Articles ───────────────────────────────────────────
@router.get("/articles")
async def list_articles_admin(
    status: Optional[str] = None,
    category_id: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    pass

@router.get("/articles/{article_id}")
async def get_article_admin(article_id: str):
    pass

@router.post("/articles", status_code=201)
async def create_article(payload: "ArticleCreate"):
    pass

@router.put("/articles/{article_id}")
async def update_article(article_id: str, payload: "ArticleUpdate"):
    pass

@router.patch("/articles/{article_id}/status")
async def update_article_status(article_id: str, payload: "ArticleStatusUpdate"):
    """Publier / archiver / repasser en brouillon."""
    pass

@router.patch("/articles/{article_id}/featured")
async def toggle_article_featured(article_id: str, payload: "ArticleFeaturedUpdate"):
    """Mettre / retirer de 'À la une'."""
    pass

@router.delete("/articles/{article_id}", status_code=204)
async def delete_article(article_id: str):
    pass


# ─── Sections & Blocs ──────────────────────────────────
@router.post("/articles/{article_id}/sections", status_code=201)
async def add_section(article_id: str, payload: "ArticleSectionCreate"):
    pass

@router.put("/sections/{section_id}")
async def update_section(section_id: str, payload: "ArticleSectionUpdate"):
    pass

@router.delete("/sections/{section_id}", status_code=204)
async def delete_section(section_id: str):
    pass

@router.post("/sections/{section_id}/blocks", status_code=201)
async def add_block(section_id: str, payload: "ArticleBlockCreate"):
    pass

@router.put("/blocks/{block_id}")
async def update_block(block_id: str, payload: "ArticleBlockUpdate"):
    pass

@router.delete("/blocks/{block_id}", status_code=204)
async def delete_block(block_id: str):
    pass

@router.put("/articles/{article_id}/sections/reorder")
async def reorder_sections(article_id: str, payload: "SectionsReorder"):
    pass


# ─── Catégories d'articles ─────────────────────────────
@router.get("/categories")
async def list_categories_admin():
    pass

@router.post("/categories", status_code=201)
async def create_category(payload: "ArticleCategoryCreate"):
    pass

@router.put("/categories/{category_id}")
async def update_category(category_id: str, payload: "ArticleCategoryUpdate"):
    pass

@router.delete("/categories/{category_id}", status_code=204)
async def delete_category(category_id: str):
    pass


# ─── Conseils quotidiens ───────────────────────────────
@router.get("/daily-tips")
async def list_daily_tips():
    pass

@router.post("/daily-tips", status_code=201)
async def create_daily_tip(payload: "DailyTipCreate"):
    pass

@router.put("/daily-tips/{tip_id}")
async def update_daily_tip(tip_id: str, payload: "DailyTipUpdate"):
    pass

@router.delete("/daily-tips/{tip_id}", status_code=204)
async def delete_daily_tip(tip_id: str):
    pass


# ─── Séries ─────────────────────────────────────────────
@router.get("/series")
async def list_series_admin():
    pass

@router.post("/series", status_code=201)
async def create_series(payload: "ArticleSeriesCreate"):
    pass

@router.put("/series/{series_id}")
async def update_series(series_id: str, payload: "ArticleSeriesUpdate"):
    pass

@router.delete("/series/{series_id}", status_code=204)
async def delete_series(series_id: str):
    pass

@router.put("/series/{series_id}/articles")
async def update_series_articles(series_id: str, payload: "SeriesArticlesUpdate"):
    """Ajouter / retirer / réordonner les articles d'une série."""
    pass


# ─── Pages statiques ───────────────────────────────────
@router.get("/pages")
async def list_pages():
    pass

@router.post("/pages", status_code=201)
async def create_page(payload: "ContentPageCreate"):
    pass

@router.put("/pages/{page_id}")
async def update_page(page_id: str, payload: "ContentPageUpdate"):
    pass

@router.delete("/pages/{page_id}", status_code=204)
async def delete_page(page_id: str):
    pass