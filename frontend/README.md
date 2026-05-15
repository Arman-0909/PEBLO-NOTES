# Peblo Notes Frontend

This is the React frontend for the **Peblo Notes** full-stack application. It is built to be playful, vibrant, and highly responsive, matching a modern ed-tech SaaS design system.

## 🚀 Technology Stack

- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Markdown**: React-Markdown & Tailwind Typography
- **HTTP Client**: Axios

## 📁 Directory Structure

```text
frontend/
├── src/
│   ├── assets/       # Static assets (Logos, Images)
│   ├── components/   # Reusable UI components (Navbar, Navigation Links)
│   ├── pages/        # Route pages (Login, Register, Dashboard, NotesList, Editor)
│   ├── App.jsx       # Main application router and layout
│   ├── api.js        # Axios instance with auth interceptors
│   ├── index.css     # Global styles and custom Tailwind @layer components
│   └── main.jsx      # React mounting point
├── package.json      # NPM dependencies and scripts
└── tailwind.config.js# Tailwind CSS configuration
```

## 🎨 Design System

The UI uses a custom "bubbly" aesthetic:
- **Typography**: `Nunito` for a playful, friendly feel.
- **Colors**: Vibrant Purples (`purple-500`, `purple-900`) and warm Ambers (`amber-400`, `amber-500`).
- **Components**: Heavy use of `border-b-4` and `border-b-8` to create tactile, 3D buttons and cards. These utility classes are centralized in `src/index.css` under `@layer components`.

## ⚙️ Setup & Installation

**1. Install Dependencies**
```bash
npm install
```

**2. Run the Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

*Note: Ensure the backend is running concurrently on `http://127.0.0.1:8000` for the app to function properly.*
