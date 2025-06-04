import json
from pathlib import Path
from datetime import datetime
from threading import Lock

STORE_PATH = Path("file_metadata.json")
_lock = Lock()


def _load() -> list:
    if STORE_PATH.exists():
        try:
            with STORE_PATH.open("r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass
    return []


def _save(data: list) -> None:
    with STORE_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def add_entry(license_key: str, filename: str, size: int, method: str) -> None:
    entry = {
        "license_key": license_key,
        "filename": filename,
        "file_size": size,
        "method": method,
        "timestamp": datetime.utcnow().isoformat(),
    }
    with _lock:
        data = _load()
        data.append(entry)
        _save(data)


def get_entries(license_key: str) -> list:
    with _lock:
        data = _load()
        return [e for e in data if e.get("license_key") == license_key]
