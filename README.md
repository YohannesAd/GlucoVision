# GlucoVision 🩺📊

An AI-powered mobile app to help diabetic patients track, understand, and manage their blood sugar levels — built with love and inspired by the developer's own family journey.

---

## 🚀 Purpose

GlucoVision is designed to help diabetic users log their glucose levels, visualize trends, and receive AI-based predictions to better manage their condition.

This project is inspired by my father, who is diabetic, and combines full-stack engineering with practical health AI to solve a real-world problem.

---

## 🧰 Tech Stack

| Layer      | Tech                                       |
| ---------- | ------------------------------------------ |
| Frontend   | React Native + Expo                        |
| Backend    | Flask (Python)                             |
| Database   | SQLite (dev) → PostgreSQL (prod)           |
| Auth       | JWT + bcrypt                               |
| AI/ML      | Pandas + Scikit-learn                      |
| Charts     | Chart.js or Recharts                       |
| Deployment | Render (backend), Expo Go (mobile testing) |

---

## 🔐 Key Features

- **User Authentication**: Register/Login securely with JWT
- **First-Time Setup**: Enter last 4 blood sugar logs to initialize AI
- **Log Glucose**: Manual input with type, value, and notes
- **View Logs**: List + chart view of glucose history
- **AI Insights**: Pattern-based predictions using ML
- **Health Report**: Generate summaries for doctor visits
- **User Profile**: View/update user info, logout securely

---

## 🧠 AI Logic Summary

- Learns from user’s past glucose logs
- Uses basic ML (e.g., linear regression) for trend detection
- Outputs insights like:
  > “Your sugar spikes are frequent after lunch. Consider reducing carbs.”

---

## 📱 Screens (WIP)

- Landing Page → Signup/Login
- Setup Wizard (Multi-step)
- Main Dashboard → Graph, Logs, AI Insights
- Report & Profile Pages

📂 Screenshots and wireframes will be added in [`/docs/wireframes`](docs/wireframes)

---

## ⚙️ How to Run It

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

cd frontend
npm install
npx expo start
