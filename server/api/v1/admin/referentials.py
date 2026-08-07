from fastapi import APIRouter

router = APIRouter(prefix="/api/admin/referentials", tags=["admin-referentials"])


# ─── Filières ───────────────────────────────────────────
@router.get("/filieres")
async def list_filieres_admin():
    pass

@router.post("/filieres", status_code=201)
async def create_filiere(payload: "FiliereCreate"):
    pass

@router.put("/filieres/{filiere_id}")
async def update_filiere(filiere_id: str, payload: "FiliereUpdate"):
    pass

@router.delete("/filieres/{filiere_id}", status_code=204)
async def delete_filiere(filiere_id: str):
    pass

@router.put("/filieres/{filiere_id}/keywords")
async def update_filiere_keywords(filiere_id: str, payload: "FiliereKeywordsUpdate"):
    """Mots-clés de matching automatique."""
    pass


# ─── Spécialités ────────────────────────────────────────
@router.get("/filieres/{filiere_id}/specialites")
async def list_specialites(filiere_id: str):
    pass

@router.post("/filieres/{filiere_id}/specialites", status_code=201)
async def create_specialite(filiere_id: str, payload: "SpecialiteCreate"):
    pass

@router.put("/specialites/{specialite_id}")
async def update_specialite(specialite_id: str, payload: "SpecialiteUpdate"):
    pass

@router.delete("/specialites/{specialite_id}", status_code=204)
async def delete_specialite(specialite_id: str):
    pass


# ─── Sources ────────────────────────────────────────────
@router.get("/sources")
async def list_sources_admin():
    pass

@router.post("/sources", status_code=201)
async def create_source(payload: "SourceCreate"):
    pass

@router.put("/sources/{source_id}")
async def update_source(source_id: str, payload: "SourceUpdate"):
    pass

@router.patch("/sources/{source_id}/status")
async def update_source_status(source_id: str, payload: "SourceStatusUpdate"):
    pass

@router.delete("/sources/{source_id}", status_code=204)
async def delete_source(source_id: str):
    pass


# ─── Contrats / Expérience / Niveaux / Localisations ───
@router.get("/contract-types")
async def list_contract_types_admin():
    pass

@router.post("/contract-types", status_code=201)
async def create_contract_type(payload: "ContractTypeCreate"):
    pass

@router.put("/contract-types/{id}")
async def update_contract_type(id: str, payload: "ContractTypeUpdate"):
    pass

@router.delete("/contract-types/{id}", status_code=204)
async def delete_contract_type(id: str):
    pass

@router.get("/experience-levels")
async def list_experience_levels_admin():
    pass

@router.post("/experience-levels", status_code=201)
async def create_experience_level(payload: "ExperienceLevelCreate"):
    pass

@router.put("/experience-levels/{id}")
async def update_experience_level(id: str, payload: "ExperienceLevelUpdate"):
    pass

@router.delete("/experience-levels/{id}", status_code=204)
async def delete_experience_level(id: str):
    pass

@router.get("/education-levels")
async def list_education_levels_admin():
    pass

@router.post("/education-levels", status_code=201)
async def create_education_level(payload: "EducationLevelCreate"):
    pass

@router.put("/education-levels/{id}")
async def update_education_level(id: str, payload: "EducationLevelUpdate"):
    pass

@router.delete("/education-levels/{id}", status_code=204)
async def delete_education_level(id: str):
    pass

@router.get("/locations")
async def list_locations_admin():
    pass

@router.post("/locations", status_code=201)
async def create_location(payload: "LocationCreate"):
    pass

@router.put("/locations/{id}")
async def update_location(id: str, payload: "LocationUpdate"):
    pass

@router.delete("/locations/{id}", status_code=204)
async def delete_location(id: str):
    pass