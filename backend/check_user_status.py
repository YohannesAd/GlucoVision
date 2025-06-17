"""
Quick script to check user onboarding status
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal
from app.models.user import User

async def check_user_status(email: str = "yohan@test.com"):
    """Check the current user's onboarding status"""
    print(f"🔍 Checking user status for: {email}")
    
    async with AsyncSessionLocal() as session:
        try:
            # Get user
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User {email} not found")
                return
            
            print(f"\n📧 User: {user.full_name} ({user.email})")
            print(f"🆔 ID: {user.id}")
            print(f"✅ Active: {user.is_active}")
            print(f"🎯 Onboarding Completed: {user.has_completed_onboarding}")
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
            print(f"📈 Preferred Unit: {user.preferred_unit}")
            print(f"🎯 Target Range: {user.target_range_min}-{user.target_range_max}")
            
            # Check what's missing
            missing_step1 = not all([
                user.date_of_birth,
                user.gender,
                user.diabetes_type,
                user.diagnosis_date
            ])
            
            missing_step2 = not all([
                user.meals_per_day,
                user.activity_level,
                user.uses_insulin is not None,
                user.sleep_duration
            ])
            
            print(f"\n📋 Missing Data Analysis:")
            print(f"   Step 1 incomplete: {missing_step1}")
            print(f"   Step 2 incomplete: {missing_step2}")
            
            if user.has_completed_onboarding:
                print(f"\n✅ User has completed onboarding!")
            else:
                print(f"\n⚠️ User has NOT completed onboarding")
                if missing_step1:
                    print("   - Missing Step 1 data (personal info)")
                if missing_step2:
                    print("   - Missing Step 2 data (medical info)")
                print("   - May be missing Step 3 data (glucose logs)")
            
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_user_status())
