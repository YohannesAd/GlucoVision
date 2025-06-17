"""
GlucoVision Database Verification Script
========================================

Simple script to verify that user accounts are being saved to the database.
Shows all registered users and their basic information.

Usage:
    python verify_database.py

Features:
- Lists all users in the database
- Shows user registration details
- Verifies database connectivity
- Professional output formatting
"""

import asyncio
import sys
import os
from datetime import datetime
from typing import List

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import AsyncSessionLocal
from app.models.user import User


async def verify_database_connection():
    """
    Verify Database Connection

    Tests if the database is accessible and responsive.
    """
    print("🔍 Checking database connection...")
    try:
        async with AsyncSessionLocal() as session:
            # Simple test query
            result = await session.execute(select(User).limit(1))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False


async def get_all_users() -> List[User]:
    """
    Get All Users from Database
    
    Retrieves all user records from the database.
    
    Returns:
        List[User]: List of all users
    """
    async with AsyncSessionLocal() as session:
        try:
            # Query all users
            result = await session.execute(select(User))
            users = result.scalars().all()
            return list(users)
        except Exception as e:
            print(f"❌ Error retrieving users: {e}")
            return []


def format_user_info(user: User) -> str:
    """
    Format User Information
    
    Creates a formatted string with user details.
    
    Args:
        user: User instance
        
    Returns:
        str: Formatted user information
    """
    created_at = user.created_at.strftime("%Y-%m-%d %H:%M:%S") if user.created_at else "Unknown"
    last_login = user.last_login.strftime("%Y-%m-%d %H:%M:%S") if user.last_login else "Never"
    
    return f"""
    📧 Email: {user.email}
    👤 Name: {user.full_name}
    🆔 ID: {user.id}
    ✅ Active: {user.is_active}
    📅 Created: {created_at}
    🔐 Last Login: {last_login}
    🎯 Onboarded: {user.is_onboarded}
    """


async def display_users():
    """
    Display All Users
    
    Shows all registered users with their information.
    """
    print("\n📋 Retrieving all users from database...")
    
    users = await get_all_users()
    
    if not users:
        print("📭 No users found in the database.")
        print("\n💡 This could mean:")
        print("   - No accounts have been created yet")
        print("   - Database connection issues")
        print("   - Database tables haven't been created")
        return
    
    print(f"\n👥 Found {len(users)} user(s) in the database:")
    print("=" * 60)
    
    for i, user in enumerate(users, 1):
        print(f"\n🔸 User #{i}:")
        print(format_user_info(user))
        print("-" * 40)


async def show_database_stats():
    """
    Show Database Statistics
    
    Displays basic statistics about the database.
    """
    print("\n📊 Database Statistics:")
    print("=" * 30)
    
    users = await get_all_users()
    total_users = len(users)
    active_users = len([u for u in users if u.is_active])
    onboarded_users = len([u for u in users if u.is_onboarded])
    
    print(f"👥 Total Users: {total_users}")
    print(f"✅ Active Users: {active_users}")
    print(f"🎯 Onboarded Users: {onboarded_users}")
    
    if users:
        latest_user = max(users, key=lambda u: u.created_at or datetime.min)
        print(f"🆕 Latest Registration: {latest_user.email}")


async def check_specific_user(email: str):
    """
    Check Specific User Details

    Shows detailed information for a specific user.
    """
    print(f"\n🔍 Checking user: {email}")
    print("=" * 40)

    async with AsyncSessionLocal() as session:
        try:
            # Query specific user
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()

            if not user:
                print(f"❌ User {email} not found")
                return

            print(f"📧 Email: {user.email}")
            print(f"👤 Name: {user.full_name}")
            print(f"🆔 ID: {user.id}")
            print(f"✅ Active: {user.is_active}")
            print(f"🎯 Onboarded: {user.has_completed_onboarding}")
            print(f"📊 Onboarding Step: {user.onboarding_step}")
            print(f"📅 Date of Birth: {user.date_of_birth}")
            print(f"⚧ Gender: {user.gender}")
            print(f"🩺 Diabetes Type: {user.diabetes_type}")
            print(f"📅 Diagnosis Date: {user.diagnosis_date}")
            print(f"🍽️ Meals per Day: {user.meals_per_day}")
            print(f"🏃 Activity Level: {user.activity_level}")
            print(f"💉 Uses Insulin: {user.uses_insulin}")
            print(f"😴 Sleep Duration: {user.sleep_duration}")
            print(f"💊 Medications: {user.current_medications}")

        except Exception as e:
            print(f"❌ Error checking user: {e}")


async def main():
    """
    Main Function

    Runs the database verification process.
    """
    print("🩺 GlucoVision Database Verification")
    print("=" * 40)

    # Check database connection
    if not await verify_database_connection():
        print("\n❌ Cannot proceed without database connection.")
        print("💡 Make sure your backend server is configured correctly.")
        return

    # Display users
    await display_users()

    # Show statistics
    await show_database_stats()

    # Check the latest user specifically
    await check_specific_user("yohan@test.com")

    print("\n✅ Database verification completed!")
    print("\n💡 Tips:")
    print("   - If you see users here, your accounts are being saved correctly")
    print("   - Check the 'Last Login' to see recent activity")
    print("   - 'Onboarded' shows if users completed the setup process")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⏹️  Verification cancelled by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("💡 Make sure your backend environment is set up correctly.")
