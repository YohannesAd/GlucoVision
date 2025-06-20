# GlucoVision 🩺📊

An AI-powered mobile app to help diabetic patients track, understand, and manage their blood sugar levels —built with modern, professional technologies and inspired by the developer's own family journey.

---

## 🚀 Purpose

GlucoVision is designed to help diabetic users log their glucose levels, visualize trends, and receive AI-based predictions to better manage their condition.

This project is inspired by my father, who is diabetic, and combines cutting-edge full-stack engineering with practical health AI to solve a real-world problem while showcasing modern development practices.

---

## 🧰 Modern Tech Stack

| Layer              | Technology                             | Why This Choice                                                     |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------- |
| **Frontend**       | React Native + TypeScript + NativeWind | Cross-platform mobile development with type safety and Tailwind CSS |
| **Backend**        | FastAPI + Python 3.11+                 | High-performance, modern API framework with auto-documentation      |
| **Database**       | PostgreSQL + SQLAlchemy                | Robust, scalable database with async support and Alembic migrations |
| **Authentication** | JWT + bcrypt + FastAPI Security        | Secure, mobile-ready authentication system                          |
| **AI Integration** | OpenAI GPT-4 API                       | Advanced AI chat and recommendations for diabetes management        |
| **API Docs**       | Auto-generated Swagger/OpenAPI         | Professional API documentation                                      |
| **PDF Reports**    | ReportLab + Custom Templates           | Medical report generation with professional formatting              |
| **Styling**        | NativeWind (Tailwind for RN)           | Utility-first CSS framework for consistent, responsive design       |
| **Navigation**     | React Navigation 6                     | Professional mobile navigation with type safety                     |

---

## 🚀 Core Features

### **🤖 AI-Powered Intelligence**

- **Smart AI Chat Assistant** - ChatGPT-style diabetes specialist with persistent conversation history
- **Intelligent Recommendations** - Data-driven glucose pattern analysis with personalized insights
- **Predictive Trend Analysis** - Weekly glucose trend analysis with proactive health suggestions
- **Pattern Recognition** - Advanced algorithms identify glucose trends and anomalies

### **📊 Blood Glucose Management**

- **Quick Entry System** - Streamlined glucose reading input with timestamp tracking
- **Comprehensive History** - Complete log storage with advanced search and filtering capabilities
- **Real-time Data Sync** - Instant updates across all application modules
- **Smart Data Validation** - Input validation ensuring accurate medical records

### **📈 Analytics & Reporting**

- **Interactive Dashboards** - Visual charts displaying glucose trends over time periods
- **Professional PDF Export** - Medical-grade reports for healthcare provider consultations
- **Custom Date Ranges** - Flexible reporting (daily, weekly, monthly, custom periods)
- **Complete Data Export** - Download full dataset in multiple formats for external analysis

### **🏥 Medical Integration**

- **Healthcare Provider Ready** - Professional documentation meeting medical standards
- **Medical Compliance** - Proper disclaimers and safety warnings throughout app
- **Secure Data Storage** - HIPAA-conscious data handling and encryption practices
- **Multi-device Compatibility** - Seamless experience across different mobile platforms

---

## 🌐 Live Production Deployment

### **🚀 Backend API (Railway)**

- **Production URL**: `https://glucovision-production.up.railway.app`
- **API Documentation**: `https://glucovision-production.up.railway.app/docs`
- **Health Check**: `https://glucovision-production.up.railway.app/health`
- **Status**: ✅ **ACTIVE** and stable

### **📡 Available Endpoints**

- 🔐 `/api/v1/auth` - Authentication & user management
- 👤 `/api/v1/users` - User profiles and settings
- 📊 `/api/v1/glucose` - Glucose data management
- 🤖 `/api/v1/ai` - AI insights and chat functionality
- 📄 `/api/v1/reports` - PDF report generation

### **🔧 Production Configuration**

- **Database**: SQLite (production-ready)
- **AI Integration**: OpenAI GPT-3.5-turbo enabled
- **Security**: JWT authentication with refresh tokens
- **Monitoring**: Health checks and error logging
- **CORS**: Configured for mobile app access

---

## 🧠 AI-Powered Features

### **OpenAI GPT-3.5-turbo Integration**

- **🤖 Intelligent Chat Assistant**: Real-time diabetes consultation with GPT-powered responses
- **📊 Data-Driven Insights**: AI analyzes user glucose patterns to provide personalized recommendations
- **🎯 Contextual Responses**: Chat system understands user's medical history and current readings
- **💬 Persistent Conversations**: Chat history saved for continuous learning and context retention

### **Smart Analytics Engine**

- **📈 Trend Recognition**: Identifies patterns in glucose readings over time periods
- **⚠️ Anomaly Detection**: Flags unusual readings that may require medical attention
- **📅 Weekly Reports**: Automated analysis of glucose trends with actionable insights
- **🎯 Personalized Recommendations**: Tailored advice based on individual glucose patterns

### **AI Chat Examples**

> **User**: _"My morning glucose is always high, what should I do?"_ > **AI**: _"Based on your readings, this could indicate dawn phenomenon. Consider discussing with your healthcare provider about adjusting your evening medication timing or bedtime snack."_

> **User**: _"Is 180 mg/dL after dinner too high?"_ > **AI**: _"A reading of 180 mg/dL 2 hours after dinner is above the recommended target of <140 mg/dL. Consider reducing carbohydrate portions or discussing meal timing with your doctor."_

---

## 📱 Application Architecture

### **Frontend (React Native + TypeScript + NativeWind)**

```
📱 Mobile App Flow:
Landing → Authentication → 3-Step Onboarding → Dashboard
├── 🏠 Dashboard (recent readings, quick actions, hamburger menu)
├── ➕ Add Glucose Log (timestamp + value entry with validation)
├── 📊 View Logs (complete history, charts, export PDF button)
├── 🤖 AI Trends (data visualization, weekly insights, recommendations)
├── 💬 AI Chat (ChatGPT-style interface, persistent history)
└── 👤 Profile (account settings, medical information editing)
```

### **3-Step Onboarding Process**

```
📋 Step 1: Personal Info (DOB, gender, diabetes type, diagnosis year)
📋 Step 2: Lifestyle Data (meals/day, activity, insulin, medications, sleep)
📋 Step 3: Initial Glucose Logs (4 readings with values and timestamps)
```

### **Backend (FastAPI + MongoDB)**

```
🏗️ API Architecture:
├── 🔐 Authentication Service (JWT tokens, secure login/signup)
├── 📊 Glucose Data Service (CRUD operations, data validation)
├── 🤖 OpenAI Integration Service (GPT-4 chat, AI recommendations)
├── 📄 PDF Generation Service (medical reports, data export)
├── 👤 User Profile Service (onboarding data, preferences)
└── 📈 Analytics Service (trend analysis, pattern recognition)
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

- ✅ **Frontend**: 95% Complete (React Native + TypeScript + NativeWind)
- ✅ **Backend**: 90% Complete (FastAPI + MongoDB + JWT Authentication)
- ✅ **AI Integration**: 85% Complete (OpenAI GPT-4 Chat + Recommendations)
- ✅ **Core Features**: Fully Implemented (Auth, Onboarding, Logging, AI Chat, PDF Export)
- 🚧 **Final Polish**: UI refinements and performance optimization
- ⏳ **Deployment**: Ready for production deployment

---

## 🎯 Professional Highlights

This project demonstrates:

- **Modern Full-Stack Development** - React Native + FastAPI with TypeScript and modern tooling
- **AI Integration Excellence** - OpenAI GPT-4 implementation for healthcare-specific applications
- **Medical Domain Expertise** - HIPAA-conscious data handling and medical compliance standards
- **Mobile-First Architecture** - Professional cross-platform development with responsive design
- **Clean Code Practices** - Well-structured components, custom hooks, and maintainable architecture
- **Professional UI/UX** - Industry-standard design patterns and user experience optimization
- **Real-World Problem Solving** - Practical healthcare application addressing genuine user needs

### **Key Technical Achievements**

- ✅ **Component Architecture** - Reusable, clean components under 150 lines each
- ✅ **Custom Hooks** - Efficient state management and API integration patterns
- ✅ **Professional Styling** - Consistent design system using NativeWind/Tailwind CSS
- ✅ **Type Safety** - Full TypeScript implementation across frontend and backend
- ✅ **API Integration** - RESTful API design with proper error handling and validation
- ✅ **Data Management** - MongoDB integration with efficient data modeling
- ✅ **Authentication** - Secure JWT-based authentication with proper session management

_Built to showcase advanced software engineering skills, modern development practices, and passion for healthcare technology innovation that impresses hiring managers._
