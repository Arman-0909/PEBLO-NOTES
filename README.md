# Peblo AI Notes App 🚀

A modern, full-stack, AI-powered notes application built with a playful and professional "bubbly" aesthetic. The app allows users to create, manage, archive, and share notes publicly, while utilizing OpenRouter AI to instantly generate summaries and extract key action items.

## ✨ Features
- **AI-Powered Insights:** Automatically summarizes notes and extracts actionable tasks using OpenRouter AI.
- **Rich Markdown Editor:** Write notes with formatting using Markdown, complete with a live preview.
- **Productivity Dashboard:** View statistics, recent activity, and your most frequently used tags.
- **Public Sharing:** Share notes with the world using an automatically generated public link.
- **Archive System:** Keep your workspace clean by archiving notes you no longer need.
- **Power-User Shortcuts:** Hit `Alt+N` to quickly create a note, or `Ctrl+S` to save instantly.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React, React-Markdown.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy, PostgreSQL.
- **AI Integration**: OpenRouter API.
- **Authentication**: JWT (JSON Web Tokens).

---

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.13+)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via cloud like Neon/Supabase)

### 1. Configure Environment Variables
Before running the application, you need to set up your environment variables.

Navigate to the `backend` folder and create a `.env` file (you can copy `.env.example` if it exists):
```bash
cd backend
touch .env
```

Add the following keys to your `.env` file:
```env
DATABASE_URL=postgresql://your_db_url
SECRET_KEY=your_super_secret_jwt_signing_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 2. Install Dependencies

**For the Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**For the Frontend:**
```bash
cd frontend
npm install
```

### 3. Run the Application

**Start the Backend Server (FastAPI):**
Open a terminal, navigate to the `backend` folder, and run:
```bash
cd backend
uvicorn app.main:app --reload
```
*The backend will run on `http://127.0.0.1:8000`*

**Start the Frontend Server (Vite React):**
Open a new terminal, navigate to the `frontend` folder, and run:
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:5173`*

### 4. How to Test the Application
We use `pytest` and `httpx` to run automated integration tests on the FastAPI backend.

To run the test suite:
1. Ensure you are in the `backend` directory.
2. Ensure you have installed the testing dependencies (`pip install pytest httpx`).
3. Run the following command:
```bash
pytest tests/
```
The test suite will automatically spin up an isolated, in-memory SQLite database to run the tests, ensuring your actual PostgreSQL database data is not touched or modified. 

---
*Built with ❤️ for the Peblo Full-Stack Challenge!*
