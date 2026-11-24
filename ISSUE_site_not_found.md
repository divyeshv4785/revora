# Issue: "Site Not Found" When Opening http://localhost:8000

**Date:** 2026-11-21  
**Project:** REVORA Backend API  
**Reporter:** Divyesh

---

## ❌ Error Encountered

When opening **http://localhost:8000** in the browser, the page shows:

```json
{"detail":"Not Found"}
```

or the browser displays a **"Site can't be reached"** / **"Not Found"** error page.

---

## 🔍 Root Cause

This is **not a bug** — it is a misunderstanding of what the application is.

The REVORA backend is a **FastAPI REST API server**, not a website with a visual frontend (HTML pages). It serves **JSON data** over HTTP, not web pages.

- The root path `/` has **no route defined** in `main.py`, so it returns `404 Not Found`.
- There is **no HTML frontend** bundled into this backend server.
- The intended frontend is the **Flutter app** (located at `revora/src/`) which connects to this API.

---

## ✅ Solution

### Option 1 — Use the Built-in Swagger UI (Recommended)

FastAPI automatically generates an interactive API explorer. Open this URL instead:

```
http://localhost:8000/docs
```

This gives you a full visual interface to browse and test all API endpoints.

---

### Option 2 — Use the Health Endpoint to Confirm Server is Running

```
http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "REVORA Backend API",
  "version": "1.0.0",
  "architecture": "FastAPI + PostgreSQL/PostGIS Modular Monolith"
}
```

---

### Option 3 — Add a Root Route (Optional Code Fix)

If you want `http://localhost:8000` to show something meaningful, add a root route to `revora/backend/app/main.py`:

```python
@app.get("/")
def root():
    return {
        "message": "Welcome to REVORA API",
        "docs": "/docs",
        "health": "/health"
    }
```

After saving, restart the server and `http://localhost:8000` will return a friendly JSON welcome message.

---

### Option 4 — Run the Flutter Frontend (Full Website)

The actual visual web UI is the Flutter app. Run it with:

```powershell
cd d:\REVORA_Complete_Project11\revora\src
flutter run -d chrome --web-port=3000
```

Then open **http://localhost:3000** in your browser for the full frontend experience.

---

## 📌 Quick Reference — Valid URLs While Server is Running

| URL | Description |
|-----|-------------|
| `http://localhost:8000/health` | Server health check (JSON) |
| `http://localhost:8000/docs` | ✅ Swagger UI — interactive API explorer |
| `http://localhost:8000/redoc` | ReDoc — alternative API documentation |
| `http://localhost:8000/api/v1/openapi.json` | Raw OpenAPI schema |

---

## 🛠️ How to Start the Server

```powershell
cd d:\REVORA_Complete_Project11\revora\backend
C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000
```
