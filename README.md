# 🛡️ Project Enclypt

**"Lock your files like a vault, without the cloud BS."**  
Project Enclypt is a license-protected encryption system for files you actually care about.  
Built for creators, devs, and designers who want control, not chaos.

---

## 🚀 What It Does

- 🔐 Encrypt any file — AI packs, artwork, zips, you name it
- 🔄 Decrypt files offline with your license key
- 🔢 Choose your encryption method:
  - 🟢 Fernet (AES-128) — fast & simple
  - 🔵 AES-256 (CBC) — stronger, account required
  - 🔴 RSA — asymmetric 
- 🔍 License validation included
- 🧠 Zero file storage, only metadata
- 🌑 Built-in dark mode (cause you're not basic)

---

## 🧠 User Tiers

| Tier     | Access                                  |
|----------|------------------------------------------|
- **Desktop Tool:** Tkinter GUI for offline decryption (now prettier)
- **Auth:** Fully functional login & signup
- **Frontend:** React + Tailwind with dark mode

---

- ✅ Dark mode UI in frontend
- ✅ Login & signup flow working
- ✅ File uploads for encrypt/decrypt
- Filename
- File hash
- Encryption method
- Timestamp
- User (if any)

**Files are never stored.**
Everything happens locally or in temp.
All file metadata is also written to a small `file_metadata.json` so the
dashboard can show your history even without a database.

---

## ⚙️ Stack

- **Backend:** FastAPI + Python (`cryptography`)
- **Database:** SQLite (simple, local)

- **Desktop Tool:** Tkinter GUI for offline decryption
- **Auth:** JWT-based login system
- **Frontend:** Coming later (with clean dark-mode UI)

---

## ✅ Current Status

- ✅ Backend encryption: Fernet, AES-256, RSA
- ✅ Secure key validation and input checks
- ✅ Decryption routes fully working
- ✅ Offline decryptor app (Tkinter GUI)

- ✅ Dark mode UI in frontend
- ✅ Login & signup flow working
- ✅ File uploads for encrypt/decrypt


---

## ⚡ Run Locally (Backend)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## ⚡ Run Offline Decryptor

Launch the Tkinter GUI for decrypting files locally:


```

✍️ Made by
@nak2002k
Built from the ground up for people who want encryption that actually respects your files.

## 🧪 Running Tests

Install test dependencies and run `pytest`:

```bash
pytest
```

