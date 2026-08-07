from fastapi import APIRouter

router = APIRouter(prefix="/api/admin/admins", tags=["admin-admins"])


@router.get("")
async def list_admins():
    pass

@router.post("", status_code=201)
async def create_admin(payload: "AdminCreate"):
    pass

@router.get("/{admin_id}")
async def get_admin(admin_id: str):
    pass

@router.put("/{admin_id}")
async def update_admin(admin_id: str, payload: "AdminUpdate"):
    pass

@router.patch("/{admin_id}/role")
async def update_admin_role(admin_id: str, payload: "AdminRoleUpdate"):
    pass

@router.patch("/{admin_id}/status")
async def toggle_admin_status(admin_id: str):
    pass

@router.delete("/{admin_id}", status_code=204)
async def delete_admin(admin_id: str):
    pass