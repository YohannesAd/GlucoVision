# 🚀 GlucoVision Development Quick Reference

## 📋 Essential Commands

### **Backend Startup**
```bash
# From project root
cd backend

# Method 1: Using run.py (Recommended)
python run.py --host 0.0.0.0 --port 8000

# Method 2: Using uvicorn directly  
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Method 3: Using virtual environment
.venv/Scripts/python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### **Frontend Startup**
```bash
# From project root
cd frontend

# Start Expo development server
npm start

# Alternative commands
npx expo start
npx expo start --clear  # Clear cache
```

### **Find Your IP Address**
```bash
# Windows
ipconfig | grep "IPv4"

# macOS/Linux
ifconfig | grep "inet"
```

## 🔧 Configuration Setup

### **1. Backend Configuration**
- **File**: `backend/.env`
- **Key Setting**: `USE_SQLITE=true` (for development)
- **Database**: SQLite (auto-created as `glucovision.db`)

### **2. Frontend Configuration**
- **File**: `frontend/src/services/api/config.ts`
- **Update Line 15**: Replace `localhost` with your computer's IP
- **Example**: `return 'http://192.168.1.100:8000';`

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | `http://YOUR_IP:8000` | Main API endpoint |
| **API Docs** | `http://YOUR_IP:8000/docs` | Swagger documentation |
| **Health Check** | `http://YOUR_IP:8000/health` | Server status |
| **Frontend** | Expo QR Code | Mobile app |

## ❌ Common Issues & Solutions

### **"Network Error" in Frontend**
1. ✅ Backend running with `--host 0.0.0.0`
2. ✅ Frontend config uses IP address (not localhost)
3. ✅ Both devices on same WiFi
4. ✅ Test: `curl http://YOUR_IP:8000/health`

### **Backend Import Errors**
```bash
# Install dependencies
pip install -r requirements.txt
pip install aiosqlite uvicorn[standard]
```

### **Frontend Cache Issues**
```bash
# Clear Expo cache
npx expo start --clear

# Restart Metro bundler
npx expo start --reset-cache
```

## 🧪 Testing Commands

### **Test Backend API**
```bash
# Health check
curl http://YOUR_IP:8000/health

# Test login endpoint
curl -X POST http://YOUR_IP:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

### **Test Database**
```bash
# From backend directory
python simple_test.py
```

## 📱 Development Workflow

### **Daily Startup Sequence**
1. **Start Backend**: `cd backend && python run.py --host 0.0.0.0 --port 8000`
2. **Verify API**: Visit `http://YOUR_IP:8000/docs`
3. **Start Frontend**: `cd frontend && npm start`
4. **Test Connection**: Try login in mobile app

### **When IP Address Changes**
1. **Find New IP**: `ipconfig | grep "IPv4"`
2. **Update Frontend**: Edit `frontend/src/services/api/config.ts`
3. **Restart Frontend**: `npx expo start --clear`

## 🔄 Process Management

### **Kill Running Processes**
```bash
# Find processes using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux

# Kill process by PID
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

### **Restart Everything**
```bash
# Kill all terminals/processes
# Restart backend with correct host
# Restart frontend with cache clear
```

## 📝 Important Notes

- **Always use `--host 0.0.0.0`** for backend (not localhost)
- **Update IP address** in frontend config when network changes
- **Use virtual environment** if Python path issues occur
- **Clear cache** if frontend shows old errors
- **Check firewall** if connection fails

---

**Quick Copy-Paste Commands:**
```bash
# Backend
cd backend && python run.py --host 0.0.0.0 --port 8000

# Frontend  
cd frontend && npm start

# Find IP
ipconfig | grep "IPv4"
```
