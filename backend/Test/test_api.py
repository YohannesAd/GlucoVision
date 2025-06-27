#!/usr/bin/env python3
"""
GlucoVision API Test Script
===========================

Simple test script to verify the API is working correctly.
Tests basic endpoints and functionality.

Usage:
    python test_api.py
"""

import asyncio
import httpx
import json
from datetime import datetime


async def test_api():
    """Test the GlucoVision API"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing GlucoVision API...")
    print(f"Base URL: {base_url}")
    print()
    
    async with httpx.AsyncClient() as client:
        # Test 1: Health Check
        print("1. Testing Health Check...")
        try:
            response = await client.get(f"{base_url}/")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Health check passed: {data['message']}")
            else:
                print(f"   ❌ Health check failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Health check error: {e}")
        
        # Test 2: API Documentation
        print("\n2. Testing API Documentation...")
        try:
            response = await client.get(f"{base_url}/docs")
            if response.status_code == 200:
                print("   ✅ API documentation accessible")
            else:
                print(f"   ❌ API documentation failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ API documentation error: {e}")
        
        # Test 3: User Registration
        print("\n3. Testing User Registration...")
        test_user = {
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "TestPass123",
            "confirm_password": "TestPass123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        try:
            response = await client.post(
                f"{base_url}/api/v1/auth/register",
                json=test_user
            )
            if response.status_code == 201:
                data = response.json()
                print("   ✅ User registration successful")
                
                # Store tokens for further testing
                access_token = data["tokens"]["access_token"]
                headers = {"Authorization": f"Bearer {access_token}"}
                
                # Test 4: Get User Profile
                print("\n4. Testing User Profile...")
                profile_response = await client.get(
                    f"{base_url}/api/v1/users/profile",
                    headers=headers
                )
                if profile_response.status_code == 200:
                    print("   ✅ User profile retrieval successful")
                else:
                    print(f"   ❌ User profile failed: {profile_response.status_code}")
                
                # Test 5: Create Glucose Log
                print("\n5. Testing Glucose Log Creation...")
                glucose_log = {
                    "glucose_value": 120,
                    "unit": "mg/dL",
                    "reading_type": "fasting",
                    "reading_time": datetime.now().isoformat(),
                    "notes": "Test reading"
                }
                
                log_response = await client.post(
                    f"{base_url}/api/v1/glucose/logs",
                    json=glucose_log,
                    headers=headers
                )
                if log_response.status_code == 201:
                    print("   ✅ Glucose log creation successful")
                    
                    # Test 6: Get Glucose Logs
                    print("\n6. Testing Glucose Log Retrieval...")
                    logs_response = await client.get(
                        f"{base_url}/api/v1/glucose/logs",
                        headers=headers
                    )
                    if logs_response.status_code == 200:
                        print("   ✅ Glucose log retrieval successful")
                    else:
                        print(f"   ❌ Glucose log retrieval failed: {logs_response.status_code}")
                else:
                    print(f"   ❌ Glucose log creation failed: {log_response.status_code}")
                
                # Test 7: AI Insights (might fail with insufficient data)
                print("\n7. Testing AI Insights...")
                ai_response = await client.get(
                    f"{base_url}/api/v1/ai/insights",
                    headers=headers
                )
                if ai_response.status_code == 200:
                    print("   ✅ AI insights successful")
                else:
                    print(f"   ⚠️  AI insights returned: {ai_response.status_code} (expected with minimal data)")
                
            else:
                print(f"   ❌ User registration failed: {response.status_code}")
                if response.status_code == 422:
                    print(f"   Validation errors: {response.json()}")
        except Exception as e:
            print(f"   ❌ User registration error: {e}")
    
    print("\n🎉 API testing completed!")
    print("\n📊 Next steps:")
    print("   • Visit http://localhost:8000/docs for interactive API documentation")
    print("   • Test the API with your React Native frontend")
    print("   • Configure your database connection in .env")
    print("   • Deploy to Railway or your preferred platform")


def main():
    """Main function"""
    print("Starting GlucoVision API tests...")
    print("Make sure the API server is running on http://localhost:8000")
    print()
    
    try:
        asyncio.run(test_api())
    except KeyboardInterrupt:
        print("\n\n⏹️  Testing interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Testing failed: {e}")


if __name__ == "__main__":
    main()
