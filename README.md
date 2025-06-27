# GlucoVision

An AI-powered mobile app that helps diabetic patients track, understand, and manage their blood sugar levels. Inspired by a personal family journey and built with modern, professional full-stack technologies.

---

## Overview

GlucoVision empowers diabetic users by:

- Logging blood glucose levels
- Visualizing health trends
- Receiving AI-based predictions and insights

Built with a strong focus on usability, AI integration, and medical-grade reporting.

---

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React Native, TypeScript, NativeWind |
| Backend    | FastAPI, Python 3.11+                |
| Database   | PostgreSQL (Prod), SQLite (Dev)      |
| Auth       | JWT, bcrypt                          |
| AI         | OpenAI GPT-4 API                     |
| Styling    | Tailwind (via NativeWind)            |
| Docs & PDF | Swagger/OpenAPI, ReportLab           |

---

## Features

### AI-Powered Intelligence

- **Chat Assistant**: Real-time GPT-powered diabetes Q\&A
- **Smart Recommendations**: Based on glucose trends
- **Predictive Analysis**: Trend recognition and suggestions

### Blood Sugar Management

- Add & track logs with timestamps
- View trends via interactive dashboards
- Export data in PDF or JSON

### Reporting & Email

- Medical-grade PDF generation
- Email verification and password recovery

---

## 📅 App Structure

### Frontend (React Native)

```
Landing → Authentication → Onboarding → Dashboard
   ├─ Home Screen
   ├─ Glucose Log + Charts
   ├─ AI Trends & Chat
   └─ Profile / Settings
```

### Backend (FastAPI)

```
Auth → Glucose Logs → AI Chat → Reports → Analytics
```

---

## 🌐 API (Production)

- **Base URL**: `https://glucovision-production.up.railway.app`
- **Docs**: `/docs`
- **Health Check**: `/health`

### Endpoints

- `/api/v1/auth` - Auth & user
- `/api/v1/glucose` - Glucose data
- `/api/v1/ai` - AI chat
- `/api/v1/reports` - Export

---

## 🚀 Setup Guide

### Backend

```bash
cd backend
cp .env.example .env  # then edit email & DB config
pip install -r requirements.txt
python run.py --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

> Update API IP in `frontend/src/services/api/config.ts` to match your local IP

---

## 🔧 Troubleshooting

- **Frontend Network Error?** Ensure backend runs on `0.0.0.0`, not `localhost`
- **API Unreachable?** Check IP, port 8000, and mobile connection
- **Backend Import Errors?** Run `pip install -r requirements.txt`

---

## 🌟 Highlights

- Clean, modular component structure
- Fully typed with TypeScript (frontend + backend)
- AI integration with OpenAI for personalized health insights
- Mobile-first, secure, and production-ready

---

## 🚧 Project Status

- 📅 Core Features: ✅ Done
- 🔍 AI Assistant: ✅ Integrated
- 📈 Analytics & Reports: ✅ Live
- 📲 Mobile UI: ✅ Polished
- ♻️ Final Refinement: ⏳ In Progress

---

Built with ❤️ for better diabetic health support and as a demonstration of professional-grade mobile, backend, and AI engineering.
