# GlucoVision 🩺📊

An AI-powered mobile app to help diabetic patients track, understand, and manage their blood sugar levels —built with modern, professional technologies and inspired by the developer's own family journey.

---

## 🚀 Purpose

GlucoVision is designed to help diabetic users log their glucose levels, visualize trends, and receive AI-based predictions to better manage their condition.

This project is inspired by my father, who is diabetic, and combines cutting-edge full-stack engineering with practical health AI to solve a real-world problem while showcasing modern development practices.

---

## 🧰 Modern Tech Stack

| Layer              | Technology                        | Why This Choice                                                |
| ------------------ | --------------------------------- | -------------------------------------------------------------- |
| **Frontend**       | React Native + Expo + TypeScript  | Cross-platform mobile development with type safety             |
| **Backend**        | FastAPI + Python 3.11+            | High-performance, modern API framework with auto-documentation |
| **Database**       | PostgreSQL + SQLAlchemy 2.0       | Enterprise-grade reliability for medical data                  |
| **Authentication** | JWT + FastAPI-Users + bcrypt      | Secure, mobile-ready authentication system                     |
| **AI/ML**          | Pandas + Scikit-learn + NumPy     | Medical-grade data analysis and pattern recognition            |
| **API Docs**       | Auto-generated Swagger/OpenAPI    | Professional API documentation                                 |
| **PDF Reports**    | ReportLab + Matplotlib            | Medical report generation with charts                          |
| **Deployment**     | Railway (backend) + Expo (mobile) | Modern cloud deployment with CI/CD                             |
| **DevOps**         | Docker + GitHub Actions           | Containerization and automated deployment                      |

---

## 🔐 Professional Features

### **Core Functionality**

- **🔐 Secure Authentication**: JWT-based registration/login with refresh tokens
- **📋 Smart Onboarding**: 3-step medical data collection for AI initialization
- **📊 Glucose Logging**: Intuitive input with timestamp, value, and contextual notes
- **📈 Data Visualization**: Interactive charts and trend analysis
- **🤖 AI-Powered Insights**: Machine learning-based pattern recognition and predictions
- **📄 Medical Reports**: Professional PDF generation for healthcare providers
- **👤 Profile Management**: Comprehensive user settings and preferences

### **Technical Excellence**

- **⚡ High Performance**: FastAPI async architecture for optimal mobile experience
- **📚 Auto Documentation**: Swagger UI for API exploration and testing
- **🔒 Medical-Grade Security**: HIPAA-compliant data handling and encryption
- **📱 Mobile-First Design**: Responsive UI optimized for all device sizes
- **🐳 Production Ready**: Docker containerization and CI/CD deployment

---

## 🧠 Advanced AI Engine

### **Intelligent Pattern Recognition**

- **📊 Glucose Trend Analysis**: Advanced time-series analysis using scikit-learn
- **🍽️ Meal Correlation Detection**: Identifies food impact patterns on blood sugar
- **⏰ Temporal Pattern Mining**: Discovers daily/weekly glucose rhythms
- **🎯 Personalized Predictions**: Custom ML models trained on individual data

### **Smart Insights Examples**

> _"Your glucose levels spike 2 hours after lunch. Consider reducing carbohydrate intake or adjusting meal timing."_

> _"Your morning readings are consistently high. This may indicate dawn phenomenon - consult your healthcare provider."_

> _"Great job! Your glucose variability has decreased 15% this month."_

---

## 📱 Application Architecture

### **Frontend (React Native + TypeScript)**

```
📱 Mobile App Flow:
Landing → Authentication → Onboarding → Dashboard
├── 🏠 Dashboard (AI insights, quick actions)
├── ➕ Add Glucose Log (smart input forms)
├── 📊 View Logs (charts, export options)
├── 🤖 AI Trends (detailed analytics)
└── 👤 Profile (settings, medical info)
```

### **Backend (FastAPI + PostgreSQL)**

```
🏗️ API Architecture:
├── 🔐 Authentication Service (JWT, user management)
├── 📊 Glucose Data Service (CRUD, validation)
├── 🤖 AI Analytics Service (ML pipeline)
├── 📄 Report Generation Service (PDF export)
└── 👤 User Profile Service (preferences, settings)
```

---

## ⚙️ Development Setup

### **🚀 Quick Start (Recommended)**

**Step 1: Start Backend**

```bash
# From project root directory
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start backend server (accessible from mobile devices)
python run.py --host 0.0.0.0 --port 8000
```

**Step 2: Update Frontend IP Configuration**

```bash
# Find your computer's IP address
ipconfig | grep "IPv4"  # Windows
ifconfig | grep "inet"  # macOS/Linux

# Update frontend/src/services/api/config.ts
# Replace 'localhost' with your computer's IP address (e.g., 192.168.1.100)
```

**Step 3: Start Frontend**

```bash
# From project root directory
cd frontend

# Install dependencies (first time only)
npm install

# Start Expo development server
npm start
```

### **📱 Access Points**

- **Backend API**: `http://YOUR_IP:8000`
- **API Documentation**: `http://YOUR_IP:8000/docs`
- **Frontend**: Scan QR code with Expo Go app

---

### **🔧 Alternative Backend Startup Methods**

```bash
# Method 1: Using run.py (Recommended)
python run.py --host 0.0.0.0 --port 8000

# Method 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Method 3: Using virtual environment python
.venv/Scripts/python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Method 4: Production mode
python run.py --prod --workers 4
```

### **📱 Frontend Development Options**

```bash
# Start development server
npm start

# Run on specific platform
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
npx expo start --web     # Web browser

# Clear cache if needed
npx expo start --clear
```

### **🐳 Docker Development**

```bash
# Build and run entire stack
docker-compose up --build

# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
# Frontend: Expo DevTools will open automatically
```

---

## 🔧 Troubleshooting

### **❌ "Network Error" in Frontend**

**Problem**: Frontend shows "Network error - please check your connection"

**Solution**:

1. **Check Backend**: Ensure backend is running with `--host 0.0.0.0`
2. **Update IP Address**: Replace `localhost` in `frontend/src/services/api/config.ts` with your computer's IP
3. **Find IP Address**:

   ```bash
   # Windows
   ipconfig | grep "IPv4"

   # macOS/Linux
   ifconfig | grep "inet"
   ```

4. **Test Backend**: Visit `http://YOUR_IP:8000/docs` in browser

### **❌ Backend Won't Start**

**Problem**: Backend fails to start or shows import errors

**Solutions**:

```bash
# Install missing dependencies
pip install -r requirements.txt

# Install specific missing packages
pip install aiosqlite uvicorn[standard]

# Use virtual environment python
.venv/Scripts/python.exe backend/run.py --host 0.0.0.0 --port 8000
```

### **❌ Frontend Won't Connect to Backend**

**Problem**: Frontend can't reach backend API

**Checklist**:

- ✅ Backend running with `--host 0.0.0.0` (not just `localhost`)
- ✅ Frontend config uses computer's IP address (not `localhost`)
- ✅ Both devices on same WiFi network
- ✅ Firewall allows port 8000

### **📱 Quick Commands Reference**

```bash
# Backend startup (from project root)
cd backend && python run.py --host 0.0.0.0 --port 8000

# Frontend startup (from project root)
cd frontend && npm start

# Find your IP address
ipconfig | grep "IPv4"  # Windows
ifconfig | grep "inet"  # macOS/Linux

# Test backend API
curl http://YOUR_IP:8000/health
```

---

## 🚀 Deployment

### **Production Deployment**

- **Backend**: Railway (FastAPI + PostgreSQL)
- **Frontend**: Expo Application Services (EAS)
- **Database**: Railway PostgreSQL with automated backups
- **Monitoring**: Built-in Railway metrics + custom health checks

### **CI/CD Pipeline**

- **GitHub Actions**: Automated testing and deployment
- **Docker**: Containerized production builds
- **Environment Management**: Separate dev/staging/prod configurations

---

## 📊 Project Status

- ✅ **Frontend**: 80% Complete (React Native + TypeScript)
- 🚧 **Backend**: In Development (FastAPI + PostgreSQL)
- 🚧 **AI Engine**: In Development (Scikit-learn + Pandas)
- ⏳ **Deployment**: Planned (Railway + EAS)

---

## 🎯 Professional Highlights

This project demonstrates:

- **Modern Full-Stack Development** with cutting-edge technologies
- **Medical Domain Expertise** with HIPAA-compliant data handling
- **AI/ML Implementation** for real-world healthcare applications
- **Mobile-First Architecture** with cross-platform compatibility
- **DevOps Best Practices** with containerization and CI/CD
- **Professional Code Quality** with TypeScript, testing, and documentation

_Built to showcase advanced software engineering skills and passion for healthcare technology innovation._
