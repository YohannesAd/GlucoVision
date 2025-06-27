"""
Test Onboarding Completion Script
=================================

Script to test the onboarding completion process for existing users.
This will complete the onboarding for a specific user to test the flow.

Usage:
    python test_onboarding.py

Features:
- Complete onboarding for existing user
- Test all 3 onboarding steps
- Verify database updates
"""

import asyncio
import sys
import os
import json
from datetime import datetime, date

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.glucose_log import GlucoseLog


async def complete_onboarding_for_user(email: str):
    """
    Complete onboarding for a specific user
    
    Args:
        email: User email address
    """
    print(f"🔄 Completing onboarding for user: {email}")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User {email} not found")
                return False
            
            print(f"📧 Found user: {user.full_name} ({user.email})")
            
            # Update user with onboarding data
            await user.update(
                session,
                # Step 1 data
                date_of_birth=datetime(1990, 5, 15),
                gender='male',
                diabetes_type='type2',
                diagnosis_date=datetime(2020, 1, 1),
                
                # Step 2 data
                meals_per_day=3,
                activity_level='moderate',
                uses_insulin=False,
                current_medications=['Metformin'],
                sleep_duration=8,
                
                # Complete onboarding
                has_completed_onboarding=True,
                onboarding_step=3
            )
            
            # Create sample glucose logs
            glucose_logs = [
                GlucoseLog(
                    user_id=user.id,
                    glucose_value=95.0,
                    unit='mg/dL',
                    reading_type='fasting',
                    meal_type=None,
                    reading_time=datetime.now(),
                    notes='Morning fasting reading'
                ),
                GlucoseLog(
                    user_id=user.id,
                    glucose_value=120.0,
                    unit='mg/dL',
                    reading_type='before_meal',
                    meal_type='lunch',
                    reading_time=datetime.now(),
                    notes='Before lunch reading'
                ),
                GlucoseLog(
                    user_id=user.id,
                    glucose_value=145.0,
                    unit='mg/dL',
                    reading_type='after_meal',
                    meal_type='lunch',
                    reading_time=datetime.now(),
                    notes='After lunch reading'
                ),
                GlucoseLog(
                    user_id=user.id,
                    glucose_value=110.0,
                    unit='mg/dL',
                    reading_type='bedtime',
                    meal_type=None,
                    reading_time=datetime.now(),
                    notes='Bedtime reading'
                ),
            ]
            
            # Add glucose logs to session
            for log in glucose_logs:
                session.add(log)
            
            # Commit all changes
            await session.commit()
            
            print("✅ Onboarding completed successfully!")
            print(f"   - Personal info updated")
            print(f"   - Medical info updated")
            print(f"   - {len(glucose_logs)} glucose logs created")
            print(f"   - Onboarding status: {user.has_completed_onboarding}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error completing onboarding: {e}")
            await session.rollback()
            return False


async def verify_onboarding_completion(email: str):
    """
    Verify that onboarding was completed successfully
    
    Args:
        email: User email address
    """
    print(f"\n🔍 Verifying onboarding completion for: {email}")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User {email} not found")
                return
            
            # Get glucose logs
            logs_result = await session.execute(
                select(GlucoseLog).where(GlucoseLog.user_id == user.id)
            )
            glucose_logs = logs_result.scalars().all()
            
            print("📊 Onboarding Status:")
            print(f"   ✅ Completed: {user.has_completed_onboarding}")
            print(f"   📊 Step: {user.onboarding_step}")
            print(f"   📅 Date of Birth: {user.date_of_birth}")
            print(f"   ⚧ Gender: {user.gender}")
            print(f"   🩺 Diabetes Type: {user.diabetes_type}")
            print(f"   🍽️ Meals per Day: {user.meals_per_day}")
            print(f"   🏃 Activity Level: {user.activity_level}")
            print(f"   💉 Uses Insulin: {user.uses_insulin}")
            print(f"   💊 Medications: {user.current_medications}")
            print(f"   😴 Sleep Duration: {user.sleep_duration}")
            print(f"   📈 Glucose Logs: {len(glucose_logs)} entries")
            
            if glucose_logs:
                print("\n📈 Glucose Log Entries:")
                for i, log in enumerate(glucose_logs, 1):
                    print(f"   {i}. {log.glucose_value} {log.unit} ({log.reading_type}) - {log.notes}")
            
        except Exception as e:
            print(f"❌ Error verifying onboarding: {e}")


async def main():
    """
    Main function to test onboarding completion
    """
    print("🧪 GlucoVision Onboarding Test")
    print("=" * 40)
    
    # Test with the latest user
    test_email = "yohan@test.com"
    
    # Complete onboarding
    success = await complete_onboarding_for_user(test_email)
    
    if success:
        # Verify completion
        await verify_onboarding_completion(test_email)
        
        print("\n✅ Onboarding test completed successfully!")
        print("\n💡 Now try logging in with this user:")
        print(f"   📧 Email: {test_email}")
        print("   🔐 Password: [your password]")
        print("   🎯 Expected: Should go directly to dashboard")
    else:
        print("\n❌ Onboarding test failed!")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⏹️  Test cancelled by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("💡 Make sure your backend environment is set up correctly.")
