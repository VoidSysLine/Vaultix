"""Entry CRUD API endpoints - real pykeepass implementation"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.core.kdbx.parser import db

router = APIRouter(prefix="/api/entries", tags=["entries"])


class EntryCreate(BaseModel):
    title: str
    username: str = ""
    password: str = ""
    url: str = ""
    notes: str = ""
    group_id: str
    custom_fields: dict[str, str] | None = None
    tags: list[str] | None = None


class EntryUpdate(BaseModel):
    title: str | None = None
    username: str | None = None
    password: str | None = None
    url: str | None = None
    notes: str | None = None
    custom_fields: dict[str, str] | None = None
    tags: list[str] | None = None


@router.get("/")
async def list_entries(group_id: str | None = None):
    """List all entries, optionally filtered by group"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    return db.list_entries(group_id)


@router.get("/search")
async def search_entries(q: str = ""):
    """Search entries"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    return db.search(q)


@router.get("/{entry_id}")
async def get_entry(entry_id: str):
    """Get a single entry by ID"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    entry = db.get_entry(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return entry


@router.post("/")
async def create_entry(data: EntryCreate):
    """Create a new entry"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    try:
        return db.create_entry(
            title=data.title,
            group_id=data.group_id,
            username=data.username,
            password=data.password,
            url=data.url,
            notes=data.notes,
            tags=data.tags,
            custom_fields=data.custom_fields,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler: {e}")


@router.put("/{entry_id}")
async def update_entry(entry_id: str, updates: EntryUpdate):
    """Update an existing entry"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    result = db.update_entry(entry_id, updates.model_dump(exclude_none=True))
    if not result:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return result


@router.delete("/{entry_id}")
async def delete_entry(entry_id: str):
    """Delete an entry (move to recycle bin)"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    success = db.delete_entry(entry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return {"success": True}
