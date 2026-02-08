"""Entry CRUD API endpoints"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/entries", tags=["entries"])


class EntryUpdate(BaseModel):
    title: str | None = None
    username: str | None = None
    password: str | None = None
    url: str | None = None
    notes: str | None = None
    custom_fields: dict[str, str] | None = None
    tags: list[str] | None = None


class EntryCreate(BaseModel):
    title: str
    username: str = ""
    password: str = ""
    url: str = ""
    notes: str = ""
    group_id: str
    custom_fields: dict[str, str] | None = None
    tags: list[str] | None = None


@router.get("/")
async def list_entries(group_id: str | None = None):
    """List all entries, optionally filtered by group"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/{entry_id}")
async def get_entry(entry_id: str):
    """Get a single entry by ID"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/")
async def create_entry(entry: EntryCreate):
    """Create a new entry"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.put("/{entry_id}")
async def update_entry(entry_id: str, updates: EntryUpdate):
    """Update an existing entry"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{entry_id}")
async def delete_entry(entry_id: str):
    """Delete an entry (move to recycle bin)"""
    raise HTTPException(status_code=501, detail="Not implemented yet")
