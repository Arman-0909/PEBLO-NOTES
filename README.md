# Peblo Notes - AI-Powered Notes Workspace

> **Built for the Peblo Full-Stack Developer Take-Home Challenge.**
> A lightweight, collaborative, AI-powered notes workspace — clean architecture, polished UI, meaningful AI integration.

---

## ✨ Features

### Core Requirements ✅
| Feature | Implementation |
|---|---|
| **Authentication** | JWT-based signup & login, bcrypt password hashing, protected routes |
| **Notes Workspace** | Create, edit, archive notes with Markdown support and tag organisation |
| **AI Integration** | Generates a summary, action items list, and a suggested title via OpenRouter |
| **Search & Filtering** | Live keyword search + tag filter with 300ms debounce, sorted by `updated_at` |
| **Public Share Page** | Toggle sharing per note — generates a unique public link, no login required |
| **Productivity Dashboard** | Active/archived/public/AI-usage stats, recent notes, top tags, weekly activity count |

### Nice-to-Haves ✅
- 🌙 **Dark mode** — System-preference aware, persisted to localStorage
- ✏️ **Markdown preview** — Write/Preview tab toggle in the editor
- ⌨️ **Keyboard shortcuts** — `Alt+N` new note, `Ctrl+S` save
- 🧪 **Automated tests** — Pytest integration tests with isolated SQLite database

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Python 3.13, FastAPI, SQLAlchemy |
| Database | PostgreSQL | neondb |
| AI Provider | OpenRouter (DeepSeek model) |
| Auth | JWT Bearer tokens |

---

## 🏗️ Architecture

```
PEBLO-NOTES/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── core/             # Database engine + JWT security
│   │   ├── models/           # SQLAlchemy models (User, Note)
│   │   ├── routers/          # Route handlers (auth, notes, dashboard)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # AI integration (OpenRouter)
│   │   └── main.py           # App entry point, CORS config
│   ├── tests/                # Pytest integration tests (isolated SQLite)
│   ├── .env.example          # Environment variable template
│   └── requirements.txt
│
└── frontend/                 # React + Vite frontend
    └── src/
        ├── components/       # Navbar
        ├── pages/            # Login, Register, Dashboard, NotesList, NoteEditor, PublicNote
        ├── api.js            # Axios instance with JWT interceptor
        └── index.css         # Design system — all Tailwind @layer components
```

**Design principle:** All styling lives in `index.css` as named component classes (`.btn-danger`, `.card-base`, `.nav-link`). React files contain only logic and structure — no inline Tailwind utility strings.

---

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.13+
- [PostgreSQL](https://www.postgresql.org/) running locally or via cloud (Neon, Supabase, etc.)

### 1. Clone & Configure Environment

```bash
git clone https://github.com/Arman-0909/PEBLO-NOTES
cd PEBLO-NOTES
```

Copy the environment template and fill in your values:
```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=
SECRET_KEY=
OPENROUTER_API_KEY=
```

Get a free OpenRouter key at [openrouter.ai](https://openrouter.ai/).

### 2. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```
→ API available at `http://127.0.0.1:8000`
→ Swagger docs at `http://127.0.0.1:8000/docs`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
→ App available at `http://localhost:5173`

### 4. Run Tests

```bash
cd backend
pytest tests/
```

Tests run against an isolated in-memory SQLite database — your PostgreSQL data is never touched.

---

## 🌐 Live Deployment

→ Frontend: https://peblo-frontend.onrender.com
→ Backend API: https://peblo-backend.onrender.com

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | ❌ |
| POST | `/auth/login` | Login, returns JWT | ❌ |
| GET | `/notes/` | List notes (search, tag, archive filter) | ✅ |
| POST | `/notes/` | Create note | ✅ |
| GET | `/notes/{id}` | Get single note | ✅ |
| PUT | `/notes/{id}` | Update note | ✅ |
| DELETE | `/notes/{id}` | Delete note | ✅ |
| PATCH | `/notes/{id}/archive` | Archive note | ✅ |
| PATCH | `/notes/{id}/unarchive` | Unarchive note | ✅ |
| PATCH | `/notes/{id}/share` | Toggle public sharing | ✅ |
| POST | `/notes/{id}/generate-ai` | Generate AI insights | ✅ |
| GET | `/notes/share/{share_id}` | View shared note (public) | ❌ |
| GET | `/dashboard/` | Productivity stats | ✅ |

---

## 🤖 AI Output Format

```json
{
  "summary": "A concise 1-2 sentence summary of the note content.",
  "action_items": ["Review the API structure", "Prepare UI mockups"],
  "suggested_title": "Sprint Planning Notes"
}
```

---

## 📸 Sample Outputs

See the [`samples/`](./samples/) directory for:
- Example API responses
- AI-generated output examples
- Database schema

---

*Built with ❤️ for the Peblo Full-Stack Challenge.*

---
