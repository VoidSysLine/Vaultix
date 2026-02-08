"""Attachment handling API endpoints"""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/attachments", tags=["attachments"])


@router.get("/{entry_id}")
async def list_attachments(entry_id: str):
    """List attachments for an entry"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/{entry_id}/{attachment_id}")
async def get_attachment(entry_id: str, attachment_id: str):
    """Download an attachment"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/{entry_id}/{attachment_id}/preview")
async def preview_attachment(entry_id: str, attachment_id: str):
    """Get a preview/thumbnail of an attachment"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/{entry_id}")
async def upload_attachment(entry_id: str):
    """Upload an attachment to an entry"""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{entry_id}/{attachment_id}")
async def delete_attachment(entry_id: str, attachment_id: str):
    """Delete an attachment"""
    raise HTTPException(status_code=501, detail="Not implemented yet")
