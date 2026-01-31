#!/usr/bin/env python3
"""
BarberX Backend API Testing Suite
Tests authentication features including PIN login and password recovery
"""

import requests
import sys
import json
from datetime import datetime

class BarberXAPITester:
    def __init__(self, base_url="https://oi-platform-147.preview.emergentagent.com"):
        self.base_url = base_url
        self.barber_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test credentials
        self.test_email = "liam@barberx.com"
        self.test_password = "newpass123"
        self.test_pin = "123456"

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            print(f"❌ {test_name} - {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f" - {response.text[:100]}"

            self.log_result(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_result(name, False, f"Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "/api/", 200)

    def test_seed_data(self):
        """Seed database with test data"""
        return self.run_test("Seed Database", "POST", "/api/seed", 200)

    def test_barber_login(self):
        """Test barber login with password"""
        success, response = self.run_test(
            "Barber Login (Password)",
            "POST",
            "/api/auth/login",
            200,
            data={"email": self.test_email, "password": self.test_password}
        )
        if success and 'token' in response:
            self.barber_token = response['token']
            return True, response
        return False, {}

    def test_check_pin_status(self):
        """Test checking if user has PIN set"""
        return self.run_test(
            "Check PIN Status",
            "GET",
            f"/api/auth/check-pin?email={self.test_email}",
            200
        )

    def test_set_pin(self):
        """Test setting PIN for user"""
        if not self.barber_token:
            self.log_result("Set PIN", False, "No barber token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.barber_token}'}
        return self.run_test(
            "Set PIN",
            "POST",
            "/api/auth/set-pin",
            200,
            data={"pin": self.test_pin},
            headers=headers
        )

    def test_pin_login(self):
        """Test login with PIN"""
        success, response = self.run_test(
            "PIN Login",
            "POST",
            "/api/auth/login-pin",
            200,
            data={"email": self.test_email, "pin": self.test_pin}
        )
        if success and 'token' in response:
            return True, response
        return False, {}

    def test_forgot_password(self):
        """Test forgot password flow"""
        success, response = self.run_test(
            "Forgot Password",
            "POST",
            "/api/auth/forgot-password",
            200,
            data={"email": self.test_email}
        )
        
        # Extract test code if available
        test_code = None
        if success and response.get('test_code'):
            test_code = response['test_code']
            print(f"   📧 Test code received: {test_code}")
        
        return success, test_code

    def test_reset_password(self, reset_code):
        """Test password reset with code"""
        if not reset_code:
            self.log_result("Reset Password", False, "No reset code available")
            return False
            
        new_password = "newpass456"
        success, response = self.run_test(
            "Reset Password",
            "POST",
            "/api/auth/reset-password",
            200,
            data={
                "email": self.test_email,
                "code": reset_code,
                "new_password": new_password
            }
        )
        
        # Test login with new password
        if success:
            login_success, _ = self.run_test(
                "Login with New Password",
                "POST",
                "/api/auth/login",
                200,
                data={"email": self.test_email, "password": new_password}
            )
            
            # Reset password back to original
            if login_success:
                self.run_test(
                    "Reset Password Back",
                    "POST",
                    "/api/auth/reset-password",
                    200,
                    data={
                        "email": self.test_email,
                        "code": reset_code,
                        "new_password": self.test_password
                    }
                )
        
        return success

    def test_barber_dashboard_features(self):
        """Test barber dashboard and sound notification features"""
        if not self.barber_token:
            self.log_result("Barber Dashboard Features", False, "No barber token available")
            return False

        headers = {'Authorization': f'Bearer {self.barber_token}'}
        
        # Test get barber profile/dashboard
        success1, _ = self.run_test("Get Barber Profile", "GET", "/api/auth/me", 200, headers=headers)
        
        # Test update barber status (online/offline)
        success2, _ = self.run_test(
            "Update Barber Status", 
            "PUT", 
            "/api/barbers/status", 
            200,
            data={"is_online": True},
            headers=headers
        )
        
        # Test home service status
        success3, _ = self.run_test(
            "Update Home Service Status", 
            "PUT", 
            "/api/barbers/home-service-status", 
            200,
            data={"is_home_service_online": True},
            headers=headers
        )
        
        return success1 and success2 and success3

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting QuickCut Backend API Tests...")
        print("=" * 50)

        # Basic tests
        self.test_root_endpoint()
        self.test_seed_data()
        
        # Authentication tests
        client_login_success = self.test_client_login()
        barber_login_success = self.test_barber_login()
        
        # Public endpoints
        self.test_get_available_barbers()
        self.test_get_all_barbers()
        self.test_barber_services()
        
        # Authenticated endpoints
        if client_login_success:
            self.test_client_auth_endpoints()
        
        if barber_login_success:
            self.test_barber_auth_endpoints()

        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = QuickCutAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())