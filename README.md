<div align="center">

# Noto

**AI-powered note-taking with spaced repetition**

A full-stack application that combines structured note-taking with active recall and AI-assisted learning. Write notes, generate flashcards and quizzes, chat with an AI tutor — all grounded in your own content via RAG.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?logo=mongodb)](https://www.mongodb.com/)

[Live Demo](https://noto-rust.vercel.app) · [API](https://noto-1-qwzb.onrender.com)

</div>

---

## Features

### Core
- **Rich Text Editor** — Tab-based editing with TipTap, auto-save, and formatting toolbar
- **Folder Hierarchy** — Tree-based navigation with context menus (rename, delete, move)
- **JWT Authentication** — Secure login with protected routes and per-user data isolation

### Active Recall
- **Flashcards** — AI-generated from your notes with question/answer pairs
- **Quiz Generation** — Multiple-choice questions with explanations
- **SM-2 Scheduling** — Spaced repetition algorithm adapts review intervals to your recall performance

### AI-Powered
- **RAG Chat** — Ask questions about your notes, answered with retrieved context via vector search
- **Note Summarization** — Brief, detailed, or bullet-point summaries on demand
- **Smart Flashcard Generation** — AI creates flashcards grounded in your actual content

### Technical
- **Vector Search** — MongoDB Atlas vector embeddings for semantic retrieval
- **Structured Logging** — Pino-based JSON logging across the full RAG pipeline
- **Dark Mode** — System-aware theme with manual toggle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS 4 |
| State | Redux Toolkit (slices + thunks) |
| Editor | TipTap (ProseMirror) |
| Components | Radix UI, Lucide Icons |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose 9, Atlas Vector Search) |
| AI | OpenRouter (qwen3-32b), Google Gemini |
| Auth | JWT (access + refresh tokens) |
| Logging | Pino |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
Noto/
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/           # Login, signup, hooks, thunks
│       │   ├── flashcards/     # Review cards, scheduling, slices
│       │   ├── folders/        # Folder tree, Redux slice, thunks
│       │   ├── navigation/     # Header, sidebar, activity bar
│       │   └── notes/          # Editor, tabs, content slices
│       ├── pages/              # Route-level components
│       ├── store/              # Redux store config
│       └── commons/            # Shared components, loaders
├── backend/
│   └── src/
│       ├── controllers/        # Route handlers
│       ├── models/             # Mongoose schemas
│       ├── services/           # AI, embeddings, chat logic
│       ├── routes/             # Express route definitions
│       ├── middlewares/         # Auth, error handling
│       └── utils/              # ApiError, logger
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- OpenRouter API key (for AI features)
- Google Gemini API key (optional, for flashcards/quiz)

### Installation

```bash
git clone https://github.com/Md-Zaid45/Noto.git
cd Noto
```

**Backend**

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```env
MONGO_DB_URI=mongodb://localhost:27017/noto
ACCESS_TOKEN_SECRET=<random-64-char-string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<random-64-char-string>
REFRESH_TOKEN_EXPIRY=7d
GEMINI_API_KEY=your-gemini-key
ORIGIN=http://localhost:5173
MODEL=qwen/qwen3-32b
LOG_LEVEL=info
```

```bash
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/users/signup` | Create account |
| POST | `/api/v1/users/login` | Login |
| POST | `/api/v1/users/logout` | Logout |
| POST | `/api/v1/users/refresh-token` | Refresh access token |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/notes/` | Create note |
| GET | `/api/v1/notes/:id` | Get note with content |
| PATCH | `/api/v1/notes/:id` | Update note name |
| DELETE | `/api/v1/notes/:id` | Delete note |
| POST | `/api/v1/notes/:id/content` | Add content block |
| PATCH | `/api/v1/notes/content/:id` | Update content block |
| DELETE | `/api/v1/notes/content/:id` | Delete content block |

### Folders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/folders/` | Create folder |
| PATCH | `/api/v1/folders/:id` | Rename folder |
| DELETE | `/api/v1/folders/:id` | Delete folder |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/ai/chat/:id?` | RAG chat (note-scoped or global) |
| POST | `/api/v1/ai/summary/:id` | Summarize note |
| POST | `/api/v1/ai/flashcards/:id` | Generate flashcards |
| POST | `/api/v1/ai/quiz/:id` | Generate quiz |

---

## Environment Variables

See `backend/.env.example` for the full list. Key variables:

| Variable | Description | Required |
|---|---|---|
| `MONGO_DB_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `ORIGIN` | Frontend URL for CORS | Yes |
| `MODEL` | AI model for chat (default: qwen/qwen3-32b) | No |
| `LOG_LEVEL` | Logging level: debug/info/warn/error | No |

---

## License

MIT
