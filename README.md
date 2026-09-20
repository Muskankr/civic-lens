# CivicLens 🔎

### AI-Powered Civic Issue Intelligence Platform

> **Turn everyday civic problems into structured, prioritized and actionable community intelligence.**

CivicLens is an AI-powered platform that helps communities report civic issues, analyze their urgency, detect related reports, and understand recurring problems.

---

## ✨ Features

- 🤖 **AI Issue Analysis** — Category, priority, confidence, impact & recommended action  
- 🚨 **Priority Detection** — HIGH, MEDIUM and LOW issue classification  
- 👥 **Related Reports** — Detects similar complaints and groups recurring issues  
- 📊 **Community Dashboard** — Track reports, priorities and issue groups  
- 🛡️ **AI Fallback** — Rule-based analysis when AI is unavailable  
- 📱 **Responsive UI** — Clean interface for desktop and mobile  

---

## 🔄 How It Works

```text
Report Issue
     ↓
Gemini AI Analysis
     ↓
Category + Priority + Impact
     ↓
Related Report Detection
     ↓
Issue Grouping
     ↓
Community Dashboard

## 🖥️ Screenshots

# Home & AI Analysis

<img width="1507" height="727" alt="Screenshot 2026-09-20 120125" src="https://github.com/user-attachments/assets/7d88dc72-db77-474b-8836-ae00cc69d89b" />

# Community Impact Dashboard

<img width="1530" height="736" alt="Screenshot 2026-09-20 120048" src="https://github.com/user-attachments/assets/dd6eb772-d2e2-4afe-8fa6-0070f1a2b822" />

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js, React, TypeScript, Tailwind CSS |
| Backend   | FastAPI, Python, SQLAlchemy         |
| AI        | Google Gemini                       |
| Database  | SQLite                              |
| API       | REST + OpenAPI                      |



## 📁 Project Structure
CivicLens/
├── civic-lens/              # Next.js frontend
├── civic-lens-backend/      # FastAPI backend
├── screenshots/             # Project screenshots
└── README.md

---

## 🚀 Run Locally

### Backend
```bash
cd civic-lens-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Create .env:

bash
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
Frontend
bash
cd civic-lens
npm install
npm run dev
Create .env.local:

bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
Open http://localhost:3000

## 🌱 Future Scope
🗺️ Geospatial issue mapping

📸 Image-based issue detection

🏛️ Municipal department integration

🔄 Real-time status tracking

📈 Advanced civic analytics

☁️ Cloud deployment with PostgreSQL

## 🏆 Hackathon
Built for HACKDAY 1.0 — DECODEP Community  
Theme: Tech for a Better Tomorrow

**CivicLens** — See a problem? Make it visible. 🔎
