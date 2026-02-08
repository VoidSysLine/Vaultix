"""Database API endpoints - real pykeepass implementation"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.core.kdbx.parser import db

router = APIRouter(prefix="/api/database", tags=["database"])


class OpenDatabaseRequest(BaseModel):
    path: str
    password: str
    key_file: str | None = None


class CreateDatabaseRequest(BaseModel):
    path: str
    password: str
    name: str = "Neue Datenbank"


@router.post("/open")
async def open_database(request: OpenDatabaseRequest):
    """Open a KDBX database file"""
    try:
        info = db.open(request.path, request.password, request.key_file)
        return {"success": True, "database": info}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    except Exception as e:
        msg = str(e)
        if "password" in msg.lower() or "credential" in msg.lower() or "invalid" in msg.lower():
            raise HTTPException(status_code=401, detail="Falsches Passwort oder Key-Datei")
        raise HTTPException(status_code=500, detail=f"Fehler beim Öffnen: {msg}")


@router.post("/create")
async def create_database(request: CreateDatabaseRequest):
    """Create a new KDBX database"""
    try:
        info = db.create(request.path, request.password, request.name)
        return {"success": True, "database": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Erstellen: {e}")


@router.post("/close")
async def close_database():
    """Close the current database"""
    db.close()
    return {"success": True}


@router.post("/save")
async def save_database():
    """Save current database to disk"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    try:
        timestamp = db.save()
        return {"success": True, "timestamp": timestamp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Speichern: {e}")


@router.get("/info")
async def get_database_info():
    """Get information about the current database"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    return db.get_info()


@router.get("/status")
async def get_status():
    """Check if a database is currently open"""
    return {"is_open": db.is_open, "path": db.path}
