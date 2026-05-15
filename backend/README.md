# Peblo Notes Backend

This is the FastAPI backend for the **Peblo Notes** full-stack application. It provides the RESTful API for authentication, note management, productivity dashboard statistics, and generative AI features.

## 🚀 Technology Stack

- **Framework**: FastAPI (Python 3.13)
- **Database**: PostgreSQL (via SQLAlchemy ORM)
- **Validation**: Pydantic
- **Authentication**: JWT Bearer Tokens with bcrypt hashing
- **Testing**: Pytest with HTTPX and an isolated in-memory SQLite database
- **AI Integration**: Generative AI (configured via environment variables)

## 📁 Directory Structure

```text
backend/
├── app/
│   ├── core/         # Core configuration (Database Engine, Security/JWT)
│   ├── models/       # SQLAlchemy Database Models (User, Note)
│   ├── routers/      # FastAPI Route Handlers (Auth, Notes, Dashboard)
│   ├── schemas/      # Pydantic Validation Schemas
│   ├── services/     # External Services (AI Integration Logic)
│   └── main.py       # Application Entry Point & CORS Setup
├── tests/            # Automated Pytest Integration Tests
├── .env              # Environment Variables Configuration
└── requirements.txt  # Python Dependencies
```

## ⚙️ Setup & Installation

**1. Install Dependencies**
```bash
pip install -r requirements.txt
```

**2. Configure Environment Variables**
Create a `.env` file in this directory with the following keys:
```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database
SECRET_KEY=your_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key  # Or GEMINI_API_KEY depending on your setup
```

**3. Run the Server**
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`. You can view the automatic Swagger UI documentation at `http://127.0.0.1:8000/docs`.

## 🧪 Testing
To run the automated test suite (which uses an isolated in-memory database to protect your data):
```bash
pytest tests/
```
