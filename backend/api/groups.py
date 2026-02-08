"""Group operations API endpoints"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/groups", tags=["groups"])


class GroupCreate(BaseModel):
    name: str
    parent_id: str | None = None
    icon: int = 0


class GroupUpdate(BaseModel):
    name: str | None = None
    icon: int | None = None


@router.get("/")
async def list_groups():
    """List all groups as tree structure"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/")
async def create_group(group: GroupCreate):
    """Create a new group"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.put("/{group_id}")
async def update_group(group_id: str, updates: GroupUpdate):
    """Update a group"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{group_id}")
async def delete_group(group_id: str):
    """Delete a group"""
    raise HTTPException(status_code=501, detail="Not implemented yet")
