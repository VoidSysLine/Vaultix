"""Vaultix Backend - FastAPI Application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api import database, entries, groups, attachments, generator, audit

app = FastAPI(
    title="Vaultix",
    description="Next-Gen KeePass Password Manager API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database.router)
app.include_router(entries.router)
app.include_router(groups.router)
app.include_router(attachments.router)
app.include_router(generator.router)
app.include_router(audit.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}
