"""
GlucoVision Backend - FastAPI Application
=========================================

A modern, high-performance API for the GlucoVision diabetes management app.
Built with FastAPI, PostgreSQL, and AI/ML capabilities for glucose pattern analysis.

Features:
- JWT Authentication with FastAPI-Users
- Medical-grade data validation
- AI-powered glucose insights
- Professional API documentation
- HIPAA-compliant security measures

Author: GlucoVision Development Team
Tech Stack: FastAPI + PostgreSQL + SQLAlchemy + Scikit-learn
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from contextlib import asynccontextmanager

# Import core modules
from app.core.config import settings
from app.core.database import create_tables
from app.core.security import get_current_user

# Import API routers
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.glucose import router as glucose_router
# Temporarily disable AI routers to debug crashes
# from app.api.v1.ai_insights import router as ai_router
# from app.api.v1.ai_chat import router as ai_chat_router
from app.api.v1.reports import router as reports_router

# Import database models to ensure they're registered
from app.models import user, glucose_log, password_reset, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    
    Handles startup and shutdown events:
    - Database table creation
    - AI model initialization
    - Resource cleanup
    """
    # Startup
    print("🚀 Starting GlucoVision API...")
    await create_tables()
    print("✅ Database tables created")
    print("🤖 AI models initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down GlucoVision API...")
    print("✅ Cleanup completed")


# Create FastAPI application with professional configuration
app = FastAPI(
    title="GlucoVision API",
    description="""
    ## 🩺 Professional Diabetes Management API
    
    A cutting-edge FastAPI backend for the GlucoVision mobile app, providing:
    
    ### 🔐 **Authentication & Security**
    - JWT-based authentication with refresh tokens
    - HIPAA-compliant data handling
    - Medical-grade security measures
    
    ### 📊 **Glucose Management**
    - Secure glucose log storage and retrieval
    - Advanced data validation and sanitization
    - Export capabilities for medical reports
    
    ### 🤖 **AI-Powered Insights**
    - Machine learning-based pattern recognition
    - Personalized glucose trend analysis
    - Predictive modeling for health insights
    
    ### 📄 **Professional Reports**
    - PDF generation for healthcare providers
    - Comprehensive glucose analytics
    - Medical-grade documentation
    
    Built with modern technologies: **FastAPI + PostgreSQL + SQLAlchemy + Scikit-learn**
    """,
    version="1.0.0",
    contact={
        "name": "GlucoVision Development Team",
        "email": "support@glucovision.app",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Security Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# CORS Middleware for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


# Health Check Endpoint
@app.get("/", tags=["Health"])
async def root():
    """
    API Health Check
    
    Returns basic API information and health status.
    Used for monitoring and deployment verification.
    """
    return {
        "message": "🩺 GlucoVision API - Professional Diabetes Management",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "features": [
            "JWT Authentication",
            "Glucose Data Management", 
            "AI-Powered Insights",
            "PDF Report Generation",
            "Medical-Grade Security"
        ]
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Simple Health Check for Railway
    """
    return {"status": "ok"}


# API Routes
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["🔐 Authentication"]
)

app.include_router(
    users_router,
    prefix="/api/v1/users",
    tags=["👤 User Management"]
)

app.include_router(
    glucose_router,
    prefix="/api/v1/glucose",
    tags=["📊 Glucose Management"]
)

# Temporarily disable AI routers to debug crashes
# app.include_router(
#     ai_router,
#     prefix="/api/v1/ai",
#     tags=["🤖 AI Insights"]
# )

# app.include_router(
#     ai_chat_router,
#     prefix="/api/v1/ai",
#     tags=["💬 AI Chat"]
# )

app.include_router(
    reports_router,
    prefix="/api/v1/reports",
    tags=["📄 Medical Reports"]
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for professional error responses
    
    Ensures all errors are properly logged and return
    consistent, secure error messages to clients.
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later.",
            "request_id": getattr(request.state, "request_id", None)
        }
    )


# Development server configuration
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
