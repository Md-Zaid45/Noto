# Noto

Noto is a modern, intuitive web‑based note‑taking and knowledge management application designed for structured thinking and effective learning. It combines a clean writing experience with built‑in active recall and spaced repetition, helping users not just store information but retain it.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://reactjs.org/)

---

## ✨ Features

- **Secure Authentication** – JWT‑based user authentication with protected routes and user‑specific data isolation.
- **Rich Text Editor** – Tab‑based editing workflow with formatting tools, auto‑save, and persistent state.
- **Hierarchical Organization** – Tree‑based folder navigation with context menus (rename, delete, move).
- **Active Recall & Spaced Repetition** – Convert notes into flashcards; SM‑2 scheduling algorithm for optimized review intervals based on recall performance.
- **Responsive & Accessible** – Clean interface that works across devices.

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| Frontend    | React, Vite, TailwindCSS           |
| State Mgmt  | Redux Toolkit (centralized store)  |
| Backend     | Node.js, Express, MongoDB          |
| Auth        | JSON Web Tokens (JWT)              |

---

## 📁 Project Structure
```
- `Noto/`
  - `backend/`
    - `package.json`
  - `frontend/`
    - `public/`
      - `vite.svg`
    - `src/`
      - `features/`
        - `auth/` – authentication components & logic
        - `flashcards/` – flashcard review components
        - `folders/` – folder slice (Redux)
        - `navigation/` – header, sidebar, context menu
        - `notes/` – editor, tabs, notes slices
      - `pages/` – route components
      - `store/` – Redux store configuration
      - `index.css`
      - `main.jsx`
    - `index.html`
    - `tailwind.config.js`
    - `vite.config.js`
    - `package.json`
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or Atlas)

### Installation

```
git clone https://github.com/Md-Zaid45/Noto.git
cd Noto
Backend setup```

cd backend
npm install
# Create a .env file with MONGO_URI and JWT_SECRET
npm run dev
Frontend setup

cd frontend
npm install
npm run dev
Visit http://localhost:5173 to open the application.
```

🛣️ Roadmap
Rich text editing

Folder hierarchy

SM‑2 spaced repetition

Full‑text search and tagging

Drag‑and‑drop folder management

Learning analytics dashboard

Offline support (PWA)

AI‑assisted note & flashcard generation

🤝 Contributing
Contributions are welcome! Please follow these steps:
```
Fork the repository.

Clone your fork: git clone https://github.com/your-username/Noto.git

Create a feature branch: git checkout -b feature/your-feature

Commit your changes: git commit -m 'Add some feature'

Push to your branch: git push origin feature/your-feature

Open a pull request.

Please ensure your code follows the project’s style guidelines and includes tests where applicable.
```
