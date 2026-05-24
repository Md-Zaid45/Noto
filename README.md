# Noto

**Noto** is a modern, intuitive web‑based note‑taking and knowledge management application designed for structured thinking and effective learning. It combines a clean writing experience with built‑in active recall and spaced repetition, helping users not just store information  but retain it.

## 🚀 Overview

Noto is built for students, developers, and lifelong learners who want a more effective way to organize and remember information. Beyond traditional note‑taking, it integrates flashcards and spaced repetition directly into the workflow.

### Built With

* **Frontend:** React, Vite, TailwindCSS
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **State Management:** Redux Toolkit
* **Authentication:** JWT (JSON Web Tokens)

---

# ✨ Features

## 🔐 Secure Authentication

* JWT‑based authentication
* Protected routes
* User‑specific data isolation
* Persistent login sessions

## 📝 Rich Text Editor

* Tab‑based editing workflow
* Auto‑save functionality
* Persistent editor state
* Clean and distraction‑free interface

## 📂 Hierarchical Organization

* Tree‑based folder navigation
* Nested folder support
* Context menus for:

  * Rename
  * Delete
  * Move

## 🧠 Active Recall & Spaced Repetition

* Convert notes into flashcards
* Integrated review workflow
* SM‑2 scheduling algorithm
* Optimized review intervals based on recall performance

## 📱 Responsive & Accessible

* Works across desktop and mobile devices
* Clean and intuitive UI
* Keyboard‑friendly interactions

---

# 🛠️ Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Frontend         | React, Vite, TailwindCSS |
| State Management | Redux Toolkit            |
| Backend          | Node.js, Express         |
| Database         | MongoDB                  |
| Authentication   | JWT                      |

---

# 📁 Project Structure

```bash
Noto/
├── backend/
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/          # Authentication logic & components
│   │   │   ├── flashcards/    # Flashcard review components
│   │   │   ├── folders/       # Folder Redux slice
│   │   │   ├── navigation/    # Header, sidebar, context menu
│   │   │   └── notes/         # Editor, tabs, note slices
│   │   │
│   │   ├── pages/             # Route components
│   │   ├── store/             # Redux store configuration
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js (v18 or later)
* MongoDB (local installation or MongoDB Atlas)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Md-Zaid45/Noto.git
cd Noto
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser and visit:

```txt
http://localhost:5173
```

---

# 🛣️ Roadmap

* [x] Rich text editing
* [x] Folder hierarchy
* [x] SM‑2 spaced repetition
* [ ] Full‑text search and tagging
* [ ] Drag‑and‑drop folder management
* [ ] Learning analytics dashboard
* [ ] Offline support (PWA)
* [ ] AI‑assisted note & flashcard generation

---

# 🤝 Contributing

Contributions are welcome!

## Steps to Contribute

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/Noto.git
```

3. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

4. Commit your changes:

```bash
git commit -m "Add some feature"
```

5. Push to your branch:

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

Please ensure your code follows the project’s style guidelines and includes tests where applicable.

---

# 📌 Future Vision

Noto aims to become more than just a note‑taking application. The long‑term goal is to build a complete learning workspace that combines:

* Knowledge management
* Active recall
* Spaced repetition
* AI‑assisted learning
* Productivity workflows

into a single seamless experience.

---

# ⭐ Support

If you like this project, consider giving it a star on GitHub — it helps a lot!
