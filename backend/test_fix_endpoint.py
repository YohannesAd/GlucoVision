"""
Test the fix onboarding endpoint
"""
import requests
import json

def test_fix_onboarding():
    """Test the fix onboarding endpoint"""
    
    # API base URL
    base_url = "http://localhost:8000"
    
    print("🔧 Testing Fix Onboarding Endpoint")
    print("=" * 40)
    
    # Step 1: Login to get token
    print("1. Logging in...")

    # Prompt for password
    import getpass
    email = input("Enter your email (default: yohan@test.com): ").strip() or "yohan@test.com"
    password = getpass.getpass("Enter your password: ")

    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        login_response = requests.post(
            f"{base_url}/api/v1/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return
        
        login_result = login_response.json()
        token = login_result["tokens"]["accessToken"]
        print("✅ Login successful")
        
        # Step 2: Call fix onboarding endpoint
        print("\n2. Calling fix onboarding endpoint...")
        
        fix_response = requests.post(
            f"{base_url}/api/v1/users/fix-onboarding",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if fix_response.status_code == 200:
            fix_result = fix_response.json()
            print("✅ Onboarding fix successful!")
            print(f"   Message: {fix_result.get('message')}")
            print(f"   Completed: {fix_result.get('has_completed_onboarding')}")
            print(f"   Logs created: {fix_result.get('glucose_logs_created', 0)}")
        else:
            print(f"❌ Fix failed: {fix_response.status_code}")
            print(f"Response: {fix_response.text}")
            return
        
        # Step 3: Test user profile endpoint
        print("\n3. Testing user profile endpoint...")
        
        profile_response = requests.get(
            f"{base_url}/api/v1/users/profile",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if profile_response.status_code == 200:
            profile_result = profile_response.json()
            print("✅ Profile fetch successful!")
            print(f"   Name: {profile_result.get('first_name')} {profile_result.get('last_name')}")
            print(f"   Email: {profile_result.get('email')}")
            print(f"   Onboarding: {profile_result.get('has_completed_onboarding')}")
            print(f"   Diabetes Type: {profile_result.get('diabetes_type')}")
        else:
            print(f"❌ Profile fetch failed: {profile_response.status_code}")
            print(f"Response: {profile_response.text}")
            return
        
        # Step 4: Test onboarding status endpoint
        print("\n4. Testing onboarding status endpoint...")
        
        status_response = requests.get(
            f"{base_url}/api/v1/users/onboarding/status",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if status_response.status_code == 200:
            status_result = status_response.json()
            print("✅ Onboarding status fetch successful!")
            print(f"   Completed: {status_result.get('has_completed_onboarding')}")
            print(f"   Current Step: {status_result.get('current_step')}")
            print(f"   Next Step: {status_result.get('next_step')}")
        else:
            print(f"❌ Status fetch failed: {status_response.status_code}")
            print(f"Response: {status_response.text}")
            return
        
        print("\n🎉 All tests passed! Your account should now work in the app.")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend is running on localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_fix_onboarding()
