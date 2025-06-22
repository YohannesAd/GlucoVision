#!/usr/bin/env python3
"""
Activate user account
"""

import asyncio
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User


async def activate_user(email: str = "yohan@test.com"):
    """Activate user account"""
    
    print(f"🔄 Activating user: {email}")
    print("=" * 60)
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found")
                return False
            
            print(f"✅ User found: {user.email}")
            print(f"🆔 User ID: {user.id}")
            print(f"📧 Email: {user.email}")
            print(f"🔓 Current active status: {user.is_active}")
            print(f"✅ Current verified status: {user.is_verified}")
            
            # Activate user
            user.is_active = True
            user.is_verified = True
            session.add(user)
            await session.commit()
            
            print(f"✅ User activated successfully!")
            print(f"🔓 New active status: {user.is_active}")
            print(f"✅ New verified status: {user.is_verified}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            await session.rollback()
            return False


if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "yohan@test.com"
    success = asyncio.run(activate_user(email))
    
    print("\n" + "=" * 60)
    if success:
        print("🎯 User activated successfully!")
    else:
        print("❌ User activation failed!")
