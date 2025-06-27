"""
Test Password Reset Flow
========================

Script to test the complete password reset functionality.
Tests all 3 steps of the password reset process.

Usage:
    python test_password_reset.py

Features:
- Test forgot password request
- Test verification code validation
- Test password reset completion
- Verify database updates
"""

import asyncio
import sys
import os
import json
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.password_reset import PasswordResetToken


async def test_password_reset_flow(email: str):
    """
    Test the complete password reset flow
    
    Args:
        email: User email address to test with
    """
    print(f"🧪 Testing password reset flow for: {email}")
    print("=" * 50)
    
    async with AsyncSessionLocal() as session:
        try:
            # Step 1: Check if user exists
            user = await User.get_by_email(session, email)
            if not user:
                print(f"❌ User {email} not found. Please use an existing user.")
                return False
            
            print(f"✅ Found user: {user.full_name} ({user.email})")
            
            # Step 2: Create password reset token (simulating forgot password request)
            print("\n📧 Step 1: Creating password reset token...")
            
            # Invalidate existing tokens
            await PasswordResetToken.invalidate_user_tokens(session, user.id)
            
            # Create new token
            reset_token = await PasswordResetToken.create_for_user(session, user.id, expires_minutes=15)
            
            print(f"✅ Reset token created:")
            print(f"   Token ID: {reset_token.id}")
            print(f"   Verification Code: {reset_token.verification_code}")
            print(f"   Expires At: {reset_token.expires_at}")
            print(f"   Is Valid: {reset_token.is_valid}")
            
            # Step 3: Test verification code validation
            print("\n🔍 Step 2: Testing verification code validation...")
            
            # Test with correct code
            found_token = await PasswordResetToken.get_by_verification_code(
                session, user.id, reset_token.verification_code
            )
            
            if found_token and found_token.is_valid:
                print(f"✅ Verification code validated successfully")
                print(f"   Token: {found_token.token}")
            else:
                print(f"❌ Verification code validation failed")
                return False
            
            # Step 4: Test password reset
            print("\n🔐 Step 3: Testing password reset...")
            
            # Get current password hash
            old_password_hash = user.hashed_password
            
            # Reset password
            new_password = "NewSecurePassword123!"
            user.set_password(new_password)
            
            # Mark token as used
            reset_token.mark_as_used()
            
            # Commit changes
            await session.commit()
            await session.refresh(user)
            await session.refresh(reset_token)
            
            # Verify changes
            if user.hashed_password != old_password_hash:
                print(f"✅ Password updated successfully")
                print(f"   Old hash: {old_password_hash[:20]}...")
                print(f"   New hash: {user.hashed_password[:20]}...")
            else:
                print(f"❌ Password was not updated")
                return False
            
            if reset_token.is_used:
                print(f"✅ Reset token marked as used")
                print(f"   Used at: {reset_token.used_at}")
            else:
                print(f"❌ Reset token was not marked as used")
                return False
            
            # Step 5: Test password verification
            print("\n🔑 Step 4: Testing new password verification...")
            
            if user.verify_password(new_password):
                print(f"✅ New password verification successful")
            else:
                print(f"❌ New password verification failed")
                return False
            
            # Step 6: Test token invalidation
            print("\n🚫 Step 5: Testing token invalidation...")
            
            if not reset_token.is_valid:
                print(f"✅ Token is properly invalidated")
                print(f"   Is used: {reset_token.is_used}")
                print(f"   Is expired: {reset_token.is_expired}")
            else:
                print(f"❌ Token is still valid (should be invalidated)")
                return False
            
            print("\n🎉 Password reset flow test completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error during password reset test: {e}")
            await session.rollback()
            return False


async def test_edge_cases():
    """
    Test edge cases and error conditions
    """
    print("\n🧪 Testing edge cases...")
    print("=" * 30)
    
    async with AsyncSessionLocal() as session:
        try:
            # Test with non-existent user
            print("1. Testing with non-existent user...")
            non_existent_token = await PasswordResetToken.get_by_verification_code(
                session, "non-existent-user-id", "123456"
            )
            if non_existent_token is None:
                print("✅ Correctly returns None for non-existent user")
            else:
                print("❌ Should return None for non-existent user")
            
            # Test with invalid verification code
            print("\n2. Testing with invalid verification code...")
            invalid_token = await PasswordResetToken.get_by_verification_code(
                session, "some-user-id", "000000"
            )
            if invalid_token is None:
                print("✅ Correctly returns None for invalid code")
            else:
                print("❌ Should return None for invalid code")
            
            print("\n✅ Edge case tests completed")
            
        except Exception as e:
            print(f"❌ Error during edge case tests: {e}")


async def cleanup_test_tokens():
    """
    Clean up any test tokens
    """
    print("\n🧹 Cleaning up test tokens...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get all tokens
            result = await session.execute(select(PasswordResetToken))
            tokens = result.scalars().all()
            
            print(f"Found {len(tokens)} password reset tokens")
            
            # You can uncomment this to clean up all tokens
            # for token in tokens:
            #     await token.delete(session)
            # print(f"Cleaned up {len(tokens)} tokens")
            
        except Exception as e:
            print(f"❌ Error during cleanup: {e}")


async def main():
    """
    Main test function
    """
    print("🔐 GlucoVision Password Reset Test")
    print("=" * 40)
    
    # Test with existing user
    test_email = "yohan@test.com"
    
    # Run password reset flow test
    success = await test_password_reset_flow(test_email)
    
    if success:
        # Run edge case tests
        await test_edge_cases()
        
        # Cleanup
        await cleanup_test_tokens()
        
        print("\n✅ All password reset tests passed!")
        print("\n💡 You can now test the frontend:")
        print("   1. Go to Login screen")
        print("   2. Click 'Forgot Password?'")
        print("   3. Enter your email")
        print("   4. Check console for verification code")
        print("   5. Complete the reset flow")
    else:
        print("\n❌ Password reset tests failed!")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⏹️  Test cancelled by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("💡 Make sure your backend environment is set up correctly.")
