#!/usr/bin/env python3
"""
GlucoVision Email Service Test Script
====================================

Test script to verify email functionality is working correctly.
Tests email configuration, SMTP connection, and email sending.

Usage:
    python test_email.py
    python test_email.py --email your-test@email.com
"""

import asyncio
import sys
import argparse
from pathlib import Path

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent))

from app.core.config import settings
from app.services.email_service import email_service


async def test_email_configuration():
    """Test email service configuration"""
    print("🔧 Testing Email Configuration...")
    print(f"   Email Enabled: {settings.ENABLE_EMAIL}")
    print(f"   SMTP Host: {settings.SMTP_HOST}")
    print(f"   SMTP Port: {settings.SMTP_PORT}")
    print(f"   SMTP Username: {settings.SMTP_USERNAME}")
    print(f"   From Email: {settings.FROM_EMAIL}")
    print(f"   From Name: {settings.FROM_NAME}")
    
    if not settings.ENABLE_EMAIL:
        print("❌ Email service is disabled. Set ENABLE_EMAIL=true in .env file.")
        return False
    
    if not all([settings.SMTP_HOST, settings.SMTP_USERNAME, settings.SMTP_PASSWORD]):
        print("❌ Email configuration incomplete. Check SMTP settings in .env file.")
        return False
    
    print("✅ Email configuration looks good!")
    return True


async def test_verification_email(test_email: str):
    """Test email verification email"""
    print(f"\n📧 Testing Verification Email to {test_email}...")
    
    try:
        success = await email_service.send_verification_email(
            to_email=test_email,
            user_name="Test User",
            verification_token="test-token-123456789"
        )
        
        if success:
            print("✅ Verification email sent successfully!")
            return True
        else:
            print("❌ Failed to send verification email.")
            return False
            
    except Exception as e:
        print(f"❌ Error sending verification email: {e}")
        return False


async def test_password_reset_email(test_email: str):
    """Test password reset email"""
    print(f"\n🔑 Testing Password Reset Email to {test_email}...")
    
    try:
        success = await email_service.send_password_reset_email(
            to_email=test_email,
            user_name="Test User",
            verification_code="123456"
        )
        
        if success:
            print("✅ Password reset email sent successfully!")
            return True
        else:
            print("❌ Failed to send password reset email.")
            return False
            
    except Exception as e:
        print(f"❌ Error sending password reset email: {e}")
        return False


async def test_welcome_email(test_email: str):
    """Test welcome email"""
    print(f"\n🎉 Testing Welcome Email to {test_email}...")
    
    try:
        success = await email_service.send_welcome_email(
            to_email=test_email,
            user_name="Test User"
        )
        
        if success:
            print("✅ Welcome email sent successfully!")
            return True
        else:
            print("❌ Failed to send welcome email.")
            return False
            
    except Exception as e:
        print(f"❌ Error sending welcome email: {e}")
        return False


async def main():
    """Main test function"""
    parser = argparse.ArgumentParser(description="Test GlucoVision email functionality")
    parser.add_argument(
        "--email", 
        type=str, 
        help="Email address to send test emails to"
    )
    args = parser.parse_args()
    
    print("🧪 GlucoVision Email Service Test")
    print("=" * 50)
    
    # Test configuration
    config_ok = await test_email_configuration()
    if not config_ok:
        print("\n❌ Email configuration test failed. Please fix configuration and try again.")
        return
    
    # Get test email
    test_email = args.email
    if not test_email:
        test_email = input("\n📧 Enter email address to send test emails to: ").strip()
    
    if not test_email:
        print("❌ No email address provided. Exiting.")
        return
    
    print(f"\n🎯 Testing email functionality with: {test_email}")
    print("=" * 50)
    
    # Run email tests
    results = []
    
    # Test verification email
    results.append(await test_verification_email(test_email))
    
    # Test password reset email
    results.append(await test_password_reset_email(test_email))
    
    # Test welcome email
    results.append(await test_welcome_email(test_email))
    
    # Summary
    print("\n📊 Test Results Summary")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All email tests passed! Email functionality is working correctly.")
    else:
        print("\n⚠️  Some email tests failed. Check configuration and try again.")
    
    print("\n💡 Tips:")
    print("   - Check your email inbox (including spam folder)")
    print("   - Verify SMTP credentials are correct")
    print("   - Ensure 2FA and app passwords are configured for Gmail")
    print("   - Check firewall settings if connection fails")


if __name__ == "__main__":
    asyncio.run(main())
