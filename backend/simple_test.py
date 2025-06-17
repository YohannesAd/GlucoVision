"""
Simple Password Reset API Test
==============================

Simple test to verify password reset endpoints work.
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.password_reset import PasswordResetToken
from app.core.database import AsyncSessionLocal


async def test_token_creation():
    """Test creating a password reset token"""
    print("🧪 Testing password reset token creation...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Create a test token
            user_id = "test-user-id"
            token = await PasswordResetToken.create_for_user(session, user_id, expires_minutes=15)
            
            print(f"✅ Token created successfully:")
            print(f"   ID: {token.id}")
            print(f"   User ID: {token.user_id}")
            print(f"   Verification Code: {token.verification_code}")
            print(f"   Token: {token.token}")
            print(f"   Expires At: {token.expires_at}")
            print(f"   Is Valid: {token.is_valid}")
            
            # Test retrieval
            found_token = await PasswordResetToken.get_by_token(session, token.token)
            if found_token:
                print(f"✅ Token retrieval successful")
            else:
                print(f"❌ Token retrieval failed")
            
            # Test verification code lookup
            code_token = await PasswordResetToken.get_by_verification_code(
                session, user_id, token.verification_code
            )
            if code_token:
                print(f"✅ Verification code lookup successful")
            else:
                print(f"❌ Verification code lookup failed")
            
            # Clean up
            await token.delete(session)
            print(f"✅ Token cleanup successful")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False


async def main():
    """Main test function"""
    print("🔐 Simple Password Reset Test")
    print("=" * 30)
    
    success = await test_token_creation()
    
    if success:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Tests failed!")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"❌ Error: {e}")
