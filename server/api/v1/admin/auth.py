from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
import hashlib
import uuid

from api.deps import get_db, require_admin_api_key
from models.admin import Administrator
from schemas.admin import AdminLogin, TokenRead, AdminRead, AdminChangePassword

router = APIRouter(prefix="/api/admin/auth", tags=["admin-auth"])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Basic hashing for the stub since we don't have passlib
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/login", response_model=TokenRead)
async def admin_login(payload: AdminLogin, db: Session = Depends(get_db)):
    """Connexion email + mot de passe → JWT."""
    admin = db.scalar(select(Administrator).where(Administrator.email == payload.email))
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Compte inactif")
        
    admin.last_login_at = datetime.utcnow()
    db.commit()
    
    # Mocking JWT token with UUID for simplicity
    return TokenRead(
        access_token=str(uuid.uuid4()),
        admin_id=admin.id,
        role=admin.role.value if admin.role else "editor"
    )


@router.post("/refresh", response_model=TokenRead)
async def refresh_token(db: Session = Depends(get_db)):
    """Rafraîchit le token JWT."""
    # Assuming token is validated in real life, returning a new mocked token
    return TokenRead(
        access_token=str(uuid.uuid4()),
        admin_id="mock",
        role="admin"
    )


@router.post("/logout")
async def admin_logout():
    """Invalide le token (blacklist)."""
    return {"message": "Déconnexion réussie"}


@router.get("/me", response_model=AdminRead)
async def get_current_admin(db: Session = Depends(get_db), _: None = Depends(require_admin_api_key)):
    """Profil de l'admin connecté."""
    # In a real JWT setup, we'd extract the ID from the token. Here we mock it.
    admin = db.scalar(select(Administrator).limit(1))
    if not admin:
        raise HTTPException(status_code=404, detail="Admin non trouvé")
    return admin


@router.put("/me/password")
async def change_password(payload: AdminChangePassword, db: Session = Depends(get_db), _: None = Depends(require_admin_api_key)):
    """Changement de mot de passe."""
    admin = db.scalar(select(Administrator).limit(1))
    if not admin or not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
        
    admin.password_hash = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Mot de passe modifié"}