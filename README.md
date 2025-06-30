# GlucoVision

An AI-powered mobile app that helps diabetic patients track, understand, and manage their blood sugar levels. Inspired by a personal family journey and built with modern, professional full-stack technologies.

---
Click this link to get a brief explanation to access the app  https://yohannesad.github.io/glucovision-installation/
<p align="center"> 
   <img src="https://github.com/user-attachments/assets/453de58e-aa0b-4be5-a40f-f3c77d64ffb6" width="150" />
   <img src= "https://github.com/user-attachments/assets/c1dbdcf3-3766-4e99-bdbe-a31ca90474f9" width="150">
    <img src="https://github.com/user-attachments/assets/de3397d2-605a-4104-8a41-f1330a9425e2" width="150" />
   <img src="https://github.com/user-attachments/assets/d60d7847-9f6b-4e77-9c04-5721358c3246" width="150" /> 
   <img src= "https://github.com/user-attachments/assets/de88028a-d884-4042-8768-16c505a271f1" width="150">
   <img src = "https://github.com/user-attachments/assets/a3e1a84e-b797-40aa-a8ad-de95fc3b6d93" width="150">
   <img src = "https://github.com/user-attachments/assets/18f20bf2-9929-4844-b0f7-723c23d090ee" width=150"


</p>






## Overview

GlucoVision helps diabetic users by:

- tracking blood glucose levels
- Visualizing health trends
- Receiving AI-based predictions and insights and with live agent that can assit you anytime.

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

##  App Structure

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

##  API (Production)

- **Base URL**: `https://glucovision-production.up.railway.app`
- **Docs**: `/docs`
- **Health Check**: `/health`

### Endpoints

- `/api/v1/auth` - Auth & user
- `/api/v1/glucose` - Glucose data
- `/api/v1/ai` - AI chat
- `/api/v1/reports` - Export

---

##  Setup Guide

### Backend

```bash
cd backend
cp .env.example .env  # then edit email & DB config
pip install -r requirements.txt
python run.py --host 0.0.0.0 --port 8000
```
### Backend (No Setup Needed )

The backend is already live and deployed at:https://glucovision-production.up.railway.app

You do **not** need to run it locally

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


---
