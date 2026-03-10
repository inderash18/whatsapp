# Premium Real-time Chat (WhatsApp-style)

This repo contains a polished real-time messaging app scaffold:

- Frontend: React + Vite + Tailwind CSS (glassmorphism UI)
- Backend: Flask + Flask-SocketIO
- Database: MongoDB (pymongo)

Folders:
- `frontend/` — React app
- `backend/` — Flask API + Socket.IO server

Quick start (dev):

1. Start MongoDB and note the connection URI.
2. Backend: create a virtualenv, set `MONGO_URI` in `.env`, then:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

This scaffold focuses on a premium UX and real-time messaging.
