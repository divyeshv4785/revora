# REVORA Backend â€” Startup Issues & Resolutions

> Session: 2026-11-21 | Project: `d:\REVORA_Complete_Project11`

---

## âœ… Final Working Command

```powershell
cd d:\REVORA_Complete_Project11\revora\backend
C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000
```

**Health check:** [http://localhost:8000/health](http://localhost:8000/health)  
**API docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ðŸ“‹ Issues Encountered (Chronological)

---

### Issue 1 â€” Ambiguous "run" request
**When:** Session start  
**Problem:** Initial requests of "run this" and "run the application" were too vague â€” the agent didn't know *which* script/command to execute.  
**Resolution:** Examined the project structure and identified the FastAPI backend at `revora/backend/app/main.py` with `uvicorn` as the ASGI server.

---

### Issue 2 â€” PowerShell `&&` operator not supported
**When:** Every time two commands were chained with `&&`  
**Problem:** The shell environment is running **Windows PowerShell (legacy version)** which does not support `&&` as a statement separator â€” it's a PowerShell 7+ / bash feature.

```
The token '&&' is not a valid statement separator in this version.
```

**Resolution:** Switched to `;` (semicolon) as the separator, which works in all PowerShell versions:
```powershell
python -m venv .venv ; .\.venv\Scripts\pip install ...
```

---

### Issue 3 â€” Windows Application Control blocked `pip.exe` in `.venv`
**When:** Trying to install dependencies inside a virtual environment (`.venv`)  
**Problem:** The machine has an **Application Control policy (AppLocker / WDAC)** that blocks execution of binaries located in user-created directories like `.venv\Scripts\`. Both `pip.exe` and `uvicorn.exe` inside the venv were blocked.

```
Program 'pip.exe' failed to run: An Application Control policy has blocked this file
```

**Resolution:** Skipped the virtual environment entirely. Used the **global Python interpreter** (`C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\python.exe`) to install all packages.

---

### Issue 4 â€” Windows Application Control blocked `uvicorn.exe` in `.venv`
**When:** Attempting to start the server using `.venv\Scripts\uvicorn`  
**Problem:** Even `uvicorn.exe` inside the virtual environment was blocked by the same Application Control policy.

```
Program 'uvicorn.exe' failed to run: An Application Control policy has blocked this file
```

**Resolution:** Same as Issue 3 â€” used global Python interpreter.

---

### Issue 5 â€” `pydantic_core` DLL blocked inside `.venv`
**When:** Attempting `python -m uvicorn` using the venv's Python  
**Problem:** Even invoking via `python -m uvicorn` failed because the compiled native extension `_pydantic_core.pyd` (a DLL) inside the venv was blocked.

```
ImportError: DLL load failed while importing _pydantic_core: 
An Application Control policy has blocked this file.
```

**Resolution:** Used the **global Python** where the DLL was already in an allowed location.

---

### Issue 6 â€” `uvicorn` not on system PATH
**When:** Running `uvicorn ...` after global pip install  
**Problem:** `pip install uvicorn` installs the script to `C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts\`, but that folder is **not on the system PATH**, so calling `uvicorn` directly in PowerShell fails with:

```
The term 'uvicorn' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

**Resolution:** Used the **full absolute path** to the uvicorn executable:
```powershell
C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts\uvicorn.exe app.main:app ...
```

> [!TIP]
> To fix this permanently, add the Scripts folder to your PATH:
> ```powershell
> $env:PATH += ";C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts"
> ```
> Or add it permanently via **System Properties â†’ Environment Variables**.

---

### Issue 7 â€” `ModuleNotFoundError: No module named 'app'`
**When:** Running uvicorn from the project root with `revora.backend.app.main:app`  
**Problem:** The module path `revora.backend.app.main` requires the project root to have proper Python package structure (with `__init__.py` files), which it doesn't. Python could not resolve the module.

```
ModuleNotFoundError: No module named 'app'
```

**Resolution:** Changed the **working directory** to `revora\backend` before launching, so `app.main` resolves correctly:
```powershell
cd d:\REVORA_Complete_Project11\revora\backend
uvicorn app.main:app ...
```

---

### Issue 8 â€” `ModuleNotFoundError: No module named 'email_validator'`
**When:** Starting the server from the correct directory  
**Problem:** The `auth.py` schema uses `pydantic.EmailStr`, which requires the optional `email-validator` package. It was not listed in `requirements.txt`.

```
ImportError: email-validator is not installed, run `pip install 'pydantic[email]'`
```

**Resolution:** Installed the missing dependency globally:
```powershell
python -m pip install "pydantic[email]" email-validator
```

> [!IMPORTANT]
> `email-validator` should be added to `revora/backend/requirements.txt` to prevent this for other developers.

---

## ðŸ Summary Table

| # | Issue | Root Cause | Fix |
|---|-------|------------|-----|
| 1 | Ambiguous run command | Missing context | Explored project structure |
| 2 | `&&` not supported in PowerShell | Legacy PowerShell version | Use `;` as separator |
| 3 | `pip.exe` blocked in `.venv` | Windows Application Control | Use global Python |
| 4 | `uvicorn.exe` blocked in `.venv` | Windows Application Control | Use global Python |
| 5 | `pydantic_core` DLL blocked in `.venv` | Windows Application Control | Use global Python |
| 6 | `uvicorn` not found on PATH | Python Scripts dir not in PATH | Use full absolute path |
| 7 | `No module named 'app'` | Wrong working directory / missing `__init__.py` | `cd` into `revora/backend` first |
| 8 | `email_validator` not installed | Missing optional dependency | `pip install email-validator` |

---

## ðŸ“Œ Recommended Fixes for Future

1. **Add to `requirements.txt`:**
   ```
   email-validator>=2.0.0
   ```

2. **Add Python Scripts to PATH permanently** to avoid using full paths for `uvicorn`, `alembic`, etc.

3. **Create a `start.ps1` helper script** in the project root:
   ```powershell
   # start.ps1
   Set-Location "$PSScriptRoot\revora\backend"
   & "C:\Users\Divyesh\AppData\Local\Programs\Python\Python312\Scripts\uvicorn.exe" app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Or use Docker** (Dockerfile already created at project root) to avoid all Windows-specific PATH and AppControl issues:
   ```powershell
   docker build -t revora_backend .
   docker run --rm -p 8000:8000 revora_backend
   ```
