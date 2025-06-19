# 🚀 GlucoVision Deployment Guide

## Quick Deployment Steps

### 1. Backend Deployment (Railway) - 5 minutes

1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Deploy Backend**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `gluco-vision` repository
   - Railway will auto-detect the FastAPI app
3. **Add PostgreSQL Database**:
   - In your project dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL` environment variable
4. **Set Environment Variables**:
   ```
   ENVIRONMENT=production
   DEBUG=false
   SECRET_KEY=your-super-secret-key-change-this-to-something-random
   USE_SQLITE=false
   CORS_ORIGINS=https://glucovision.vercel.app,http://localhost:3000
   ALLOWED_HOSTS=*.railway.app,glucovision.vercel.app
   ```
5. **Copy your Railway URL** (e.g., `https://glucovision-backend-production.up.railway.app`)

### 2. Frontend Deployment (Vercel) - 3 minutes

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Deploy Frontend**:
   - Click "New Project" → Import your `gluco-vision` repository
   - Set **Root Directory** to `frontend`
   - Vercel will auto-detect React/Expo setup
3. **Update API Configuration**:
   - Edit `frontend/src/services/api/config.ts`
   - Replace the production URL with your Railway backend URL:
   ```typescript
   return 'https://your-railway-backend-url.railway.app';
   ```
4. **Deploy**: Click "Deploy" and wait 2-3 minutes

### 3. Final Configuration

1. **Update CORS in Backend**:
   - Add your Vercel URL to Railway environment variables:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   ```

2. **Test the Deployment**:
   - Visit your Vercel URL
   - Try signing up and logging in
   - Test core features

## 🎯 Result

- **Frontend**: `https://glucovision.vercel.app` (or your custom domain)
- **Backend API**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

## 📱 Reviewer Access

Send this to hiring managers:

> **GlucoVision - AI-Powered Diabetes Management App**
> 
> 🌐 **Live Demo**: https://glucovision.vercel.app
> 📚 **API Documentation**: https://your-backend.railway.app/docs
> 💻 **Source Code**: https://github.com/yourusername/gluco-vision
> 
> **Test Account**:
> - Email: demo@glucovision.app
> - Password: Demo123!
> 
> **Features to Try**:
> - Sign up and complete 3-step onboarding
> - Add glucose readings
> - View AI insights and trends
> - Try the AI chat assistant
> - Export PDF reports

## 🔧 Troubleshooting

**Backend Issues**:
- Check Railway logs for errors
- Ensure all environment variables are set
- Verify PostgreSQL database is connected

**Frontend Issues**:
- Check Vercel build logs
- Ensure API URL is correct in config.ts
- Verify CORS settings in backend

**CORS Errors**:
- Add your Vercel domain to CORS_ORIGINS in Railway
- Redeploy backend after updating environment variables

## 💰 Cost

- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (unlimited for personal projects)
- **Total**: $0/month for demo purposes

Perfect for showcasing to potential employers!
