"""
Get Latest Verification Code
============================

Simple script to get the latest verification code for testing.
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.core.database import AsyncSessionLocal
from app.DatabaseModels.password_reset import PasswordResetToken
from app.DatabaseModels.user import User


async def get_latest_verification_code(email: str):
    """Get the latest verification code for a user"""
    print(f"🔍 Getting latest verification code for: {email}")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found")
                return
            
            # Get latest token
            result = await session.execute(
                select(PasswordResetToken)
                .where(PasswordResetToken.user_id == user.id)
                .order_by(desc(PasswordResetToken.created_at))
                .limit(1)
            )
            token = result.scalar_one_or_none()
            
            if not token:
                print(f"❌ No verification codes found for {email}")
                return
            
            print(f"✅ Latest verification code: {token.verification_code}")
            print(f"   Created: {token.created_at}")
            print(f"   Expires: {token.expires_at}")
            print(f"   Is Valid: {token.is_valid}")
            print(f"   Is Used: {token.is_used}")
            
            return token.verification_code
            
        except Exception as e:
            print(f"❌ Error: {e}")


async def main():
    """Main function"""
    code = await get_latest_verification_code("yohan@test.com")
    if code:
        print(f"\n🎯 Use this code in your app: {code}")


if __name__ == "__main__":
    asyncio.run(main())
