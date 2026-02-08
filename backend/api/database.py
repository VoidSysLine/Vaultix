"""Database API endpoints"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/database", tags=["database"])


class OpenDatabaseRequest(BaseModel):
    path: str
    password: str
    key_file: str | None = None


class DatabaseInfo(BaseModel):
    name: str
    description: str
    path: str
    version: str
    cipher: str
    kdf: str
    entry_count: int
    group_count: int


@router.post("/open")
async def open_database(request: OpenDatabaseRequest):
    """Open a KDBX database file"""
    # TODO: Implement with pykeepass
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/close")
async def close_database():
    """Close the current database"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/save")
async def save_database():
    """Save current database to disk"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/info", response_model=DatabaseInfo)
async def get_database_info():
    """Get information about the current database"""
    raise HTTPException(status_code=501, detail="Not implemented yet")
