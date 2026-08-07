from fastapi import APIRouter

router = APIRouter(prefix="/api/admin/scraping", tags=["admin-scraping"])


@router.get("/status")
async def get_scraping_status():
    """État des 4 sources : dernier passage, durée, erreurs."""
    pass


@router.post("/trigger")
async def trigger_scraping(payload: "ScrapingTrigger"):
    """Déclenche un scraping manuel (toutes sources ou une seule)."""
    pass


@router.get("/runs")
async def list_scraping_runs(limit: int = 30, offset: int = 0):
    pass


@router.get("/runs/{run_id}")
async def get_scraping_run(run_id: str):
    pass


@router.get("/runs/{run_id}/logs")
async def get_scraping_run_logs(run_id: str):
    """Logs associés à un run."""
    pass