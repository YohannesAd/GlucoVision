# 🔄 Backend Switching Guide

## Quick Commands

### Check Current Backend
```bash
cd frontend
node switch-backend.js status
```

### Switch to Railway (Production)
```bash
cd frontend
node switch-backend.js railway
```

### Switch to Local Development
```bash
cd frontend
node switch-backend.js local
```

## Manual Method

### Option 1: Edit .env file directly
```bash
# For Railway backend
EXPO_PUBLIC_API_URL=https://glucovision-production.up.railway.app

# For Local backend  
EXPO_PUBLIC_API_URL=http://localhost:8000

# For Network backend (your IP)
EXPO_PUBLIC_API_URL=http://10.0.0.226:8000
```

### Option 2: Copy pre-configured files
```bash
# Use Railway backend
cp .env.railway .env

# Use Local backend
cp .env.local .env
```

## Important Notes

⚠️ **Always restart Expo after changing backend:**
```bash
# Stop current server (Ctrl+C)
# Then restart
npm start
```

🔍 **Check connection in app console:**
- Look for API URL logs when app starts
- Verify successful API calls in network tab

## Current Configuration

✅ **Your frontend is currently configured for Railway backend**
- API URL: `https://glucovision-production.up.railway.app`
- This means your app will use the deployed backend on Railway
- Perfect for testing your latest deployed changes!

## Troubleshooting

### If Railway backend doesn't work:
1. Check Railway deployment status
2. Verify backend is running: `curl https://glucovision-production.up.railway.app/health`
3. Check Railway logs for errors

### If Local backend doesn't work:
1. Make sure backend is running: `cd backend && python run.py`
2. Verify local API: `curl http://localhost:8000/health`
3. Check firewall/antivirus blocking port 8000
