"""Group operations API endpoints - real pykeepass implementation"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.core.kdbx.parser import db

router = APIRouter(prefix="/api/groups", tags=["groups"])


class GroupCreate(BaseModel):
    name: str
    parent_id: str | None = None


class GroupUpdate(BaseModel):
    name: str | None = None
    icon: int | None = None


@router.get("/")
async def list_groups():
    """List all groups as tree structure"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    return db.list_groups()


@router.post("/")
async def create_group(group: GroupCreate):
    """Create a new group"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    try:
        return db.create_group(group.name, group.parent_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler: {e}")


@router.put("/{group_id}")
async def update_group(group_id: str, updates: GroupUpdate):
    """Update a group"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    result = db.update_group(group_id, updates.name)
    if not result:
        raise HTTPException(status_code=404, detail="Gruppe nicht gefunden")
    return result


@router.delete("/{group_id}")
async def delete_group(group_id: str):
    """Delete a group"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    success = db.delete_group(group_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gruppe nicht gefunden")
    return {"success": True}
