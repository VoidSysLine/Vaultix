"""KDBX database operations using pykeepass"""

from __future__ import annotations

import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from pykeepass import PyKeePass, create_database
from pykeepass.entry import Entry as KPEntry
from pykeepass.group import Group as KPGroup


class KdbxDatabase:
    """Wrapper around pykeepass for KDBX operations"""

    def __init__(self):
        self._kp: PyKeePass | None = None
        self._path: str | None = None

    @property
    def is_open(self) -> bool:
        return self._kp is not None

    @property
    def path(self) -> str | None:
        return self._path

    def open(self, path: str, password: str, keyfile: str | None = None) -> dict:
        """Open a KDBX database file"""
        kf = keyfile if keyfile else None
        self._kp = PyKeePass(path, password=password, keyfile=kf)
        self._path = path
        return self.get_info()

    def create(self, path: str, password: str, name: str = "Vaultix Database") -> dict:
        """Create a new KDBX database"""
        self._kp = create_database(path, password=password)
        self._kp.root_group.name = name
        self._kp.save()
        self._path = path
        return self.get_info()

    def close(self) -> None:
        """Close the database"""
        self._kp = None
        self._path = None

    def save(self) -> str:
        """Save changes to disk"""
        self._ensure_open()
        self._kp.save()
        return datetime.now().isoformat()

    def save_as(self, path: str) -> None:
        """Save to a new file"""
        self._ensure_open()
        self._kp.save(path)
        self._path = path

    def get_info(self) -> dict:
        """Get database metadata"""
        self._ensure_open()
        entries = self._kp.entries or []
        groups = self._kp.groups or []
        return {
            "name": self._kp.root_group.name or "Database",
            "description": "",
            "path": self._path,
            "version": "4.0",
            "cipher": "ChaCha20",
            "kdf": "Argon2id",
            "entry_count": len(entries),
            "group_count": len(groups),
        }

    # ==========================================
    # Entry Operations
    # ==========================================

    def list_entries(self, group_id: str | None = None) -> list[dict]:
        """List all entries, optionally filtered by group"""
        self._ensure_open()
        if group_id:
            group = self._find_group_by_uuid(group_id)
            if group:
                entries = group.entries or []
            else:
                entries = []
        else:
            entries = self._kp.entries or []
        return [self._entry_to_dict(e) for e in entries]

    def get_entry(self, entry_id: str) -> dict | None:
        """Get single entry by UUID"""
        self._ensure_open()
        entry = self._find_entry_by_uuid(entry_id)
        if entry:
            return self._entry_to_dict(entry)
        return None

    def create_entry(
        self,
        title: str,
        group_id: str,
        username: str = "",
        password: str = "",
        url: str = "",
        notes: str = "",
        tags: list[str] | None = None,
        custom_fields: dict[str, str] | None = None,
    ) -> dict:
        """Create a new entry"""
        self._ensure_open()
        group = self._find_group_by_uuid(group_id)
        if not group:
            group = self._kp.root_group

        entry = self._kp.add_entry(
            group,
            title=title,
            username=username,
            password=password,
            url=url,
            notes=notes,
            tags=tags,
        )

        if custom_fields:
            for key, value in custom_fields.items():
                entry.set_custom_property(key, value)

        self._kp.save()
        return self._entry_to_dict(entry)

    def update_entry(self, entry_id: str, updates: dict[str, Any]) -> dict | None:
        """Update an entry"""
        self._ensure_open()
        entry = self._find_entry_by_uuid(entry_id)
        if not entry:
            return None

        if "title" in updates and updates["title"] is not None:
            entry.title = updates["title"]
        if "username" in updates and updates["username"] is not None:
            entry.username = updates["username"]
        if "password" in updates and updates["password"] is not None:
            entry.password = updates["password"]
        if "url" in updates and updates["url"] is not None:
            entry.url = updates["url"]
        if "notes" in updates and updates["notes"] is not None:
            entry.notes = updates["notes"]
        if "tags" in updates and updates["tags"] is not None:
            entry.tags = updates["tags"]

        if "custom_fields" in updates and updates["custom_fields"]:
            for key, value in updates["custom_fields"].items():
                entry.set_custom_property(key, value)

        self._kp.save()
        return self._entry_to_dict(entry)

    def delete_entry(self, entry_id: str) -> bool:
        """Move entry to recycle bin or delete permanently"""
        self._ensure_open()
        entry = self._find_entry_by_uuid(entry_id)
        if not entry:
            return False

        # Move to recycle bin if it exists
        recycle_bin = self._kp.recyclebin_group
        if recycle_bin:
            self._kp.move_entry(entry, recycle_bin)
        else:
            self._kp.delete_entry(entry)

        self._kp.save()
        return True

    # ==========================================
    # Group Operations
    # ==========================================

    def list_groups(self) -> list[dict]:
        """Get group tree"""
        self._ensure_open()
        root = self._kp.root_group
        return self._build_group_tree(root)

    def create_group(self, name: str, parent_id: str | None = None) -> dict:
        """Create a new group"""
        self._ensure_open()
        parent = self._find_group_by_uuid(parent_id) if parent_id else self._kp.root_group
        if not parent:
            parent = self._kp.root_group

        group = self._kp.add_group(parent, name)
        self._kp.save()
        return self._group_to_dict(group)

    def update_group(self, group_id: str, name: str | None = None) -> dict | None:
        """Update a group"""
        self._ensure_open()
        group = self._find_group_by_uuid(group_id)
        if not group:
            return None

        if name is not None:
            group.name = name

        self._kp.save()
        return self._group_to_dict(group)

    def delete_group(self, group_id: str) -> bool:
        """Delete a group"""
        self._ensure_open()
        group = self._find_group_by_uuid(group_id)
        if not group or group == self._kp.root_group:
            return False

        self._kp.delete_group(group)
        self._kp.save()
        return True

    # ==========================================
    # Attachment Operations
    # ==========================================

    def list_attachments(self, entry_id: str) -> list[dict]:
        """List attachments for an entry"""
        self._ensure_open()
        entry = self._find_entry_by_uuid(entry_id)
        if not entry:
            return []

        result = []
        for att in entry.attachments or []:
            result.append({
                "id": str(att.id),
                "filename": att.filename,
                "size": len(att.data) if att.data else 0,
            })
        return result

    def get_attachment_data(self, entry_id: str, attachment_id: str) -> tuple[str, bytes] | None:
        """Get attachment filename and raw data"""
        self._ensure_open()
        entry = self._find_entry_by_uuid(entry_id)
        if not entry:
            return None

        for att in entry.attachments or []:
            if str(att.id) == attachment_id:
                return (att.filename, att.data or b"")
        return None

    # ==========================================
    # Search
    # ==========================================

    def search(self, query: str) -> list[dict]:
        """Search entries by title, username, url, notes"""
        self._ensure_open()
        q = query.lower()
        results = []
        for entry in self._kp.entries or []:
            if any(
                q in (getattr(entry, field) or "").lower()
                for field in ("title", "username", "url", "notes")
            ):
                results.append(self._entry_to_dict(entry))
        return results

    # ==========================================
    # Private Helpers
    # ==========================================

    def _ensure_open(self) -> None:
        if not self._kp:
            raise RuntimeError("No database open")

    def _find_entry_by_uuid(self, entry_id: str) -> KPEntry | None:
        try:
            uid = uuid.UUID(entry_id)
            entries = self._kp.find_entries(uuid=uid, first=True)
            return entries
        except (ValueError, Exception):
            return None

    def _find_group_by_uuid(self, group_id: str) -> KPGroup | None:
        try:
            uid = uuid.UUID(group_id)
            groups = self._kp.find_groups(uuid=uid, first=True)
            return groups
        except (ValueError, Exception):
            return None

    def _entry_to_dict(self, entry: KPEntry) -> dict:
        custom_fields = {}
        for key, value in (entry.custom_properties or {}).items():
            protected = key in (entry._element.findall('.//String[Key="{}"]'.format(key)) or [])
            custom_fields[key] = {"value": value or "", "protected": False}

        attachments = []
        for att in entry.attachments or []:
            attachments.append({
                "id": str(att.id),
                "filename": att.filename,
                "size": len(att.data) if att.data else 0,
            })

        return {
            "id": str(entry.uuid),
            "title": entry.title or "",
            "username": entry.username or "",
            "password": entry.password or "",
            "url": entry.url or "",
            "notes": entry.notes or "",
            "icon": entry.icon or 0,
            "tags": list(entry.tags or []),
            "group_id": str(entry.group.uuid) if entry.group else "",
            "custom_fields": custom_fields,
            "attachments": attachments,
            "created": entry.ctime.isoformat() if entry.ctime else "",
            "modified": entry.mtime.isoformat() if entry.mtime else "",
            "expiry_time": entry.expiry_time.isoformat() if entry.expiry_time else None,
        }

    def _group_to_dict(self, group: KPGroup) -> dict:
        return {
            "id": str(group.uuid),
            "name": group.name or "",
            "icon": group.icon or 0,
            "parent_id": str(group.parentgroup.uuid) if group.parentgroup else None,
            "children": [],
            "entry_count": len(group.entries or []),
        }

    def _build_group_tree(self, group: KPGroup) -> list[dict]:
        """Recursively build group tree from root's direct children"""
        result = []
        for child in group.subgroups or []:
            item = self._group_to_dict(child)
            item["children"] = self._build_group_tree(child)
            result.append(item)
        return result


# Singleton instance
db = KdbxDatabase()
