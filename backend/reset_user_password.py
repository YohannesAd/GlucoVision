#!/usr/bin/env python3
"""
Reset user password manually
"""

import asyncio
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import security_manager


async def reset_password(email: str = "yohan@test.com", new_password: str = "password123"):
    """Reset user password"""
    
    print(f"🔄 Resetting password for: {email}")
    print(f"🔑 New password: {new_password}")
    print("=" * 60)
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found")
                return
            
            print(f"✅ User found: {user.email}")
            print(f"📧 Current email: {user.email}")
            print(f"🆔 User ID: {user.id}")
            
            # Check current password
            print(f"🔍 Current hashed password: {user.hashed_password[:50]}...")
            
            # Test current password
            if security_manager.verify_password("password123", user.hashed_password):
                print("✅ Current password 'password123' is valid")
            else:
                print("❌ Current password 'password123' is NOT valid")

            # Hash new password
            new_hashed_password = security_manager.hash_password(new_password)
            print(f"🔑 New hashed password: {new_hashed_password[:50]}...")

            # Update password
            user.hashed_password = new_hashed_password
            session.add(user)
            await session.commit()

            print(f"✅ Password updated successfully!")

            # Verify new password
            if security_manager.verify_password(new_password, user.hashed_password):
                print(f"✅ New password '{new_password}' verified successfully!")
            else:
                print(f"❌ New password '{new_password}' verification failed!")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            await session.rollback()
            return False


async def test_login(email: str = "yohan@test.com", password: str = "password123"):
    """Test login with given credentials"""
    
    print(f"\n🧪 Testing login for: {email}")
    print(f"🔑 Password: {password}")
    print("=" * 60)
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found")
                return False
            
            # Verify password
            if security_manager.verify_password(password, user.hashed_password):
                print(f"✅ Login successful for {email}")
                return True
            else:
                print(f"❌ Login failed for {email} - invalid password")
                return False
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "test":
            # Test login
            email = sys.argv[2] if len(sys.argv) > 2 else "yohan@test.com"
            password = sys.argv[3] if len(sys.argv) > 3 else "password123"
            success = asyncio.run(test_login(email, password))
        else:
            # Reset password
            email = sys.argv[1] if len(sys.argv) > 1 else "yohan@test.com"
            new_password = sys.argv[2] if len(sys.argv) > 2 else "password123"
            success = asyncio.run(reset_password(email, new_password))
    else:
        # Default: reset to password123
        success = asyncio.run(reset_password())
    
    print("\n" + "=" * 60)
    if success:
        print("🎯 Operation completed successfully!")
    else:
        print("❌ Operation failed!")
