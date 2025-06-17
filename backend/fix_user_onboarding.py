"""
Fix existing user's onboarding data
This script will complete the onboarding for your existing account
"""
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.glucose_log import GlucoseLog, ReadingTypeEnum

async def fix_user_onboarding(email: str = "yohan@test.com"):
    """Fix the existing user's onboarding data"""
    print(f"🔧 Fixing onboarding data for: {email}")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User {email} not found")
                return False
            
            print(f"📧 Found user: {user.full_name} ({user.email})")
            print(f"Current onboarding status: {user.has_completed_onboarding}")
            
            # Update user with complete onboarding data
            await user.update(
                session,
                # Step 1 data - Personal Information
                date_of_birth=datetime(1990, 5, 15),
                gender='male',
                diabetes_type='type2',
                diagnosis_date=datetime(2020, 1, 1),
                
                # Step 2 data - Medical Information
                meals_per_day=3,
                activity_level='moderate',
                uses_insulin=False,
                current_medications=['Metformin'],
                sleep_duration=8,
                
                # Step 3 data - Preferences
                preferred_unit='mg/dL',
                target_range_min=80,
                target_range_max=180,
                
                # Complete onboarding
                has_completed_onboarding=True,
                onboarding_step=3
            )
            
            print("✅ Updated user profile with onboarding data")
            
            # Check if user already has glucose logs
            logs_result = await session.execute(
                select(GlucoseLog).where(GlucoseLog.user_id == user.id)
            )
            existing_logs = logs_result.scalars().all()
            
            if existing_logs:
                print(f"📊 User already has {len(existing_logs)} glucose logs")
            else:
                # Create sample glucose logs for Step 3
                glucose_logs = [
                    GlucoseLog(
                        user_id=user.id,
                        glucose_value=95.0,
                        unit='mg/dL',
                        reading_type=ReadingTypeEnum.FASTING,
                        reading_time=datetime(2024, 6, 14, 8, 0),
                        logged_time=datetime.utcnow(),
                        is_validated=True
                    ),
                    GlucoseLog(
                        user_id=user.id,
                        glucose_value=140.0,
                        unit='mg/dL',
                        reading_type=ReadingTypeEnum.AFTER_MEAL,
                        reading_time=datetime(2024, 6, 14, 14, 0),
                        logged_time=datetime.utcnow(),
                        is_validated=True
                    ),
                    GlucoseLog(
                        user_id=user.id,
                        glucose_value=110.0,
                        unit='mg/dL',
                        reading_type=ReadingTypeEnum.BEFORE_MEAL,
                        reading_time=datetime(2024, 6, 14, 18, 0),
                        logged_time=datetime.utcnow(),
                        is_validated=True
                    ),
                    GlucoseLog(
                        user_id=user.id,
                        glucose_value=105.0,
                        unit='mg/dL',
                        reading_type=ReadingTypeEnum.BEDTIME,
                        reading_time=datetime(2024, 6, 14, 22, 0),
                        logged_time=datetime.utcnow(),
                        is_validated=True
                    )
                ]
                
                # Add glucose logs to session
                for log in glucose_logs:
                    session.add(log)
                
                print(f"📊 Created {len(glucose_logs)} sample glucose logs")
            
            # Commit all changes
            await session.commit()
            
            print("\n✅ Onboarding fix completed successfully!")
            print(f"   ✅ Personal info: Complete")
            print(f"   ✅ Medical info: Complete")
            print(f"   ✅ Glucose logs: Complete")
            print(f"   ✅ Onboarding status: {user.has_completed_onboarding}")
            
            # Verify the fix
            await session.refresh(user)
            print(f"\n🔍 Verification:")
            print(f"   📧 Email: {user.email}")
            print(f"   🎯 Onboarding: {user.has_completed_onboarding}")
            print(f"   📊 Step: {user.onboarding_step}")
            print(f"   📅 DOB: {user.date_of_birth}")
            print(f"   ⚧ Gender: {user.gender}")
            print(f"   🩺 Diabetes: {user.diabetes_type}")
            print(f"   🍽️ Meals: {user.meals_per_day}")
            print(f"   🏃 Activity: {user.activity_level}")
            print(f"   💉 Insulin: {user.uses_insulin}")
            print(f"   😴 Sleep: {user.sleep_duration}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error fixing onboarding: {e}")
            await session.rollback()
            return False

if __name__ == "__main__":
    print("🔧 GlucoVision Onboarding Fix Tool")
    print("=" * 40)
    
    try:
        success = asyncio.run(fix_user_onboarding())
        if success:
            print("\n🎉 SUCCESS! Your account onboarding has been fixed.")
            print("💡 Now try logging into the app again - the dashboard should work!")
        else:
            print("\n❌ Failed to fix onboarding. Please check the errors above.")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
