#!/usr/bin/env python3
"""
Test timezone handling for glucose log validation
"""

from datetime import datetime, timezone
import pytz
from app.schemas.glucose import GlucoseLogCreate

def test_timezone_validation():
    """Test the timezone validation logic"""
    
    print("🕐 Testing Timezone Validation")
    print("=" * 60)
    
    # Current time in different timezones
    now_utc = datetime.now(timezone.utc)
    eastern = pytz.timezone('US/Eastern')
    now_eastern = now_utc.astimezone(eastern)
    
    print(f"Current UTC time: {now_utc}")
    print(f"Current Eastern time: {now_eastern}")
    print()
    
    # Test 1: Current time (should pass)
    print("Test 1: Current Eastern time (should PASS)")
    try:
        current_eastern_naive = now_eastern.replace(tzinfo=None)
        print(f"Testing time: {current_eastern_naive} (Eastern, naive)")
        
        # This should pass with our new validation
        test_data = {
            "glucose_value": 120.0,
            "reading_type": "fasting",
            "reading_time": current_eastern_naive
        }
        
        log = GlucoseLogCreate(**test_data)
        print("✅ PASSED - Current time accepted")
    except Exception as e:
        print(f"❌ FAILED - {e}")
    
    print()
    
    # Test 2: 4 AM Eastern (should pass if it's after 4 AM)
    print("Test 2: 4 AM Eastern today (should PASS if current time > 4 AM)")
    try:
        today_4am_eastern = now_eastern.replace(hour=4, minute=0, second=0, microsecond=0, tzinfo=None)
        print(f"Testing time: {today_4am_eastern} (4 AM Eastern, naive)")
        
        test_data = {
            "glucose_value": 120.0,
            "reading_type": "fasting", 
            "reading_time": today_4am_eastern
        }
        
        log = GlucoseLogCreate(**test_data)
        print("✅ PASSED - 4 AM Eastern accepted")
    except Exception as e:
        print(f"❌ FAILED - {e}")
    
    print()
    
    # Test 3: 10 PM Eastern (should pass if it's after 10 PM)
    print("Test 3: 10 PM Eastern today (should PASS if current time > 10 PM)")
    try:
        today_10pm_eastern = now_eastern.replace(hour=22, minute=0, second=0, microsecond=0, tzinfo=None)
        print(f"Testing time: {today_10pm_eastern} (10 PM Eastern, naive)")
        
        test_data = {
            "glucose_value": 120.0,
            "reading_type": "after_meal",
            "reading_time": today_10pm_eastern
        }
        
        log = GlucoseLogCreate(**test_data)
        print("✅ PASSED - 10 PM Eastern accepted")
    except Exception as e:
        print(f"❌ FAILED - {e}")
    
    print()
    
    # Test 4: Future time (should fail)
    print("Test 4: Future time (should FAIL)")
    try:
        future_eastern = now_eastern.replace(hour=23, minute=59, second=59, tzinfo=None)
        if future_eastern <= now_eastern.replace(tzinfo=None):
            # If 23:59 is not in the future, add a day
            from datetime import timedelta
            future_eastern = future_eastern + timedelta(days=1)
        
        print(f"Testing time: {future_eastern} (Future Eastern, naive)")
        
        test_data = {
            "glucose_value": 120.0,
            "reading_type": "bedtime",
            "reading_time": future_eastern
        }
        
        log = GlucoseLogCreate(**test_data)
        print("❌ UNEXPECTED - Future time was accepted (should have failed)")
    except Exception as e:
        print(f"✅ EXPECTED - Future time rejected: {e}")
    
    print()
    print("=" * 60)
    print("🎯 Timezone validation test completed!")

if __name__ == "__main__":
    test_timezone_validation()
