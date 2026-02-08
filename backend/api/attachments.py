"""Attachment handling API endpoints - real pykeepass implementation"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from backend.core.kdbx.parser import db

router = APIRouter(prefix="/api/attachments", tags=["attachments"])


@router.get("/{entry_id}")
async def list_attachments(entry_id: str):
    """List attachments for an entry"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    return db.list_attachments(entry_id)


@router.get("/{entry_id}/{attachment_id}")
async def get_attachment(entry_id: str, attachment_id: str):
    """Download an attachment"""
    if not db.is_open:
        raise HTTPException(status_code=400, detail="Keine Datenbank geöffnet")
    result = db.get_attachment_data(entry_id, attachment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Anhang nicht gefunden")
    filename, data = result
    return Response(
        content=data,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
