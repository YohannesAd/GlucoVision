#!/usr/bin/env python3
"""
Simple server startup script for GlucoVision backend
"""

import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import uvicorn
    from app.main import app
    
    print("🚀 Starting GlucoVision API Server...")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("📋 ReDoc Documentation: http://localhost:8000/redoc")
    print()
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
    
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Please install required dependencies:")
    print("pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting server: {e}")
    sys.exit(1)
