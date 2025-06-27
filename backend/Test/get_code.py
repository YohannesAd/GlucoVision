#!/usr/bin/env python3
"""
Quick Verification Code Getter
=============================

Simple script to get the latest verification code for testing.
Run this after requesting a password reset.
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.core.database import AsyncSessionLocal
from app.models.password_reset import PasswordResetToken
from app.models.user import User


async def get_verification_code(email: str):
    """Get the latest verification code for a user"""
    print(f"🔍 Getting verification code for: {email}")
    print("=" * 50)
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found")
                print("💡 Make sure you've created an account with this email")
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
                print("💡 Try requesting a password reset first")
                return
            
            print(f"✅ VERIFICATION CODE: {token.verification_code}")
            print(f"📅 Created: {token.created_at}")
            print(f"⏰ Expires: {token.expires_at}")
            print(f"🔄 Is Valid: {token.is_valid}")
            print(f"✔️ Is Used: {token.is_used}")
            print("=" * 50)
            
            if not token.is_valid:
                if token.is_used:
                    print("⚠️ This code has already been used")
                elif token.is_expired:
                    print("⚠️ This code has expired")
                print("💡 Request a new password reset to get a fresh code")
            
            return token.verification_code
            
        except Exception as e:
            print(f"❌ Error: {e}")


async def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python get_code.py your-email@example.com")
        return
    
    email = sys.argv[1]
    await get_verification_code(email)


if __name__ == "__main__":
    asyncio.run(main())
