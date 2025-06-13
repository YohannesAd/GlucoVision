#!/usr/bin/env python3
"""
GlucoVision Backend Startup Script
==================================

Professional startup script for the GlucoVision FastAPI backend.
Handles development and production server startup with proper configuration.

Usage:
    python run.py              # Development server
    python run.py --prod       # Production server
    python run.py --help       # Show help
"""

import uvicorn
import argparse
import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings


def main():
    """Main startup function"""
    parser = argparse.ArgumentParser(description="GlucoVision API Server")
    parser.add_argument(
        "--prod", 
        action="store_true", 
        help="Run in production mode"
    )
    parser.add_argument(
        "--host", 
        default="0.0.0.0", 
        help="Host to bind to (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port", 
        type=int, 
        default=8000, 
        help="Port to bind to (default: 8000)"
    )
    parser.add_argument(
        "--workers", 
        type=int, 
        default=1, 
        help="Number of worker processes (production only)"
    )
    
    args = parser.parse_args()
    
    # Print startup banner
    print_banner()
    
    # Check environment file
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Warning: .env file not found. Using default settings.")
        print("   Copy .env.example to .env and configure your settings.")
        print()
    
    # Configure server settings
    if args.prod:
        print("🚀 Starting GlucoVision API in PRODUCTION mode...")
        uvicorn.run(
            "app.main:app",
            host=args.host,
            port=args.port,
            workers=args.workers,
            log_level="info",
            access_log=True,
            reload=False
        )
    else:
        print("🔧 Starting GlucoVision API in DEVELOPMENT mode...")
        print(f"📊 API Documentation: http://{args.host}:{args.port}/docs")
        print(f"📋 ReDoc Documentation: http://{args.host}:{args.port}/redoc")
        print()
        
        uvicorn.run(
            "app.main:app",
            host=args.host,
            port=args.port,
            reload=True,
            log_level="debug",
            access_log=True
        )


def print_banner():
    """Print startup banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║                    🩺 GlucoVision API 🩺                     ║
    ║                                                              ║
    ║              Professional Diabetes Management API            ║
    ║                                                              ║
    ║  Features:                                                   ║
    ║  • 🔐 JWT Authentication & Security                          ║
    ║  • 📊 Comprehensive Glucose Tracking                        ║
    ║  • 🤖 AI-Powered Insights & Recommendations                 ║
    ║  • 📄 Medical Report Generation                             ║
    ║  • 📱 Mobile-First API Design                               ║
    ║                                                              ║
    ║  Tech Stack: FastAPI + PostgreSQL + SQLAlchemy + AI/ML      ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Debug Mode: {settings.DEBUG}")
    print(f"Database: {'SQLite' if settings.USE_SQLITE else 'PostgreSQL'}")
    print(f"AI Insights: {'Enabled' if settings.ENABLE_AI_INSIGHTS else 'Disabled'}")
    print()


if __name__ == "__main__":
    main()
