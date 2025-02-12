# Vite + React + Flask App

![Vite](https://raw.githubusercontent.com/devicons/devicon/master/icons/vite/vite-original.svg) ![React](https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg) ![Flask](https://raw.githubusercontent.com/devicons/devicon/master/icons/flask/flask-original.svg) ![Python](https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg) ![JavaScript](https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg)

## 🚀 About the Project

This project is a full-stack web application built using **Vite + React** for the frontend and **Flask** for the backend. It integrates user authentication, AI-powered meme generation, social media interactions, and analytics features.

## 🏗️ Tech Stack

- **Frontend:** Vite, React, React Router
- **Backend:** Flask, Flask-JWT-Extended, Flask-Mail, Flask-CORS
- **Database:** SQLAlchemy
- **Authentication:** JWT, OAuth (Twitter)
- **Cloud Storage:** Cloudinary
- **AI Features:** Meme Generation
- **Session Management:** Flask-Session

## 📌 Features

- User Authentication (JWT-based, Social Media OAuth via Twitter)
- AI-Powered Meme Generation (Text and Image)
- Twitter Integration (Profile Data, Post Scheduling, AI Marketing)
- Cloudinary Integration for Image Uploads
- User Dashboard with Analytics and Scheduling Tools
- Secure API with Flask and Flask-JWT-Extended
- Optimized Frontend with Vite for fast builds

## 📂 Project Structure

```
📦 project-root
 ┣ 📂 backend (Flask API)
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 database
 ┃ ┣ 📜 app.py
 ┃ ┣ 📜 config.py
 ┃ ┗ 📜 requirements.txt
 ┣ 📂 frontend (React + Vite)
 ┃ ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┣ 📂 pages
 ┃ ┣ 📜 App.jsx
 ┃ ┣ 📜 main.jsx
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

## 🛠️ Installation and Setup

### Prerequisites

- Node.js & npm
- Python & pip
- Virtual Environment (optional but recommended)

### 1️⃣ Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
flask run
```

### 2️⃣ Frontend Setup (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

## 🌍 Environment Variables

Create a `.env` file in the backend and frontend directories with required API keys, database URLs, and JWT secrets.

## 🎯 API Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/api/auth/login`      | User login                 |
| POST   | `/api/auth/register`   | User registration          |
| GET    | `/api/twitter/profile` | Fetch Twitter profile data |
| POST   | `/api/ai/meme-gen`     | Generate meme              |

## 📸 Screenshots

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo, submit PRs, and report issues.
