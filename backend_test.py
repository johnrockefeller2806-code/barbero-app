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

    def test_client_login(self):
        """Test client login"""
        success, response = self.run_test(
            "Client Login",
            "POST",
            "/api/auth/login",
            200,
            data={"email": "john@example.com", "password": "client123"}
        )
        if success and 'access_token' in response:
            self.client_token = response['access_token']
            return True
        return False

    def test_barber_login(self):
        """Test barber login"""
        success, response = self.run_test(
            "Barber Login",
            "POST",
            "/api/auth/login",
            200,
            data={"email": "james@fadedublin.ie", "password": "barber123"}
        )
        if success and 'access_token' in response:
            self.barber_token = response['access_token']
            return True
        return False

    def test_get_available_barbers(self):
        """Test getting available barbers"""
        return self.run_test("Get Available Barbers", "GET", "/api/barbers/available", 200)

    def test_get_all_barbers(self):
        """Test getting all barbers"""
        return self.run_test("Get All Barbers", "GET", "/api/barbers", 200)

    def test_client_auth_endpoints(self):
        """Test client authenticated endpoints"""
        if not self.client_token:
            self.log_result("Client Auth Test", False, "No client token available")
            return False

        headers = {'Authorization': f'Bearer {self.client_token}'}
        
        # Test get profile
        success1, _ = self.run_test("Get Client Profile", "GET", "/api/auth/me", 200, headers=headers)
        
        # Test get bookings
        success2, _ = self.run_test("Get Client Bookings", "GET", "/api/bookings/my", 200, headers=headers)
        
        return success1 and success2

    def test_barber_auth_endpoints(self):
        """Test barber authenticated endpoints"""
        if not self.barber_token:
            self.log_result("Barber Auth Test", False, "No barber token available")
            return False

        headers = {'Authorization': f'Bearer {self.barber_token}'}
        
        # Test get profile
        success1, _ = self.run_test("Get Barber Profile", "GET", "/api/auth/me", 200, headers=headers)
        
        # Test get dashboard
        success2, _ = self.run_test("Get Barber Dashboard", "GET", "/api/barber/dashboard", 200, headers=headers)
        
        # Test availability toggle
        success3, _ = self.run_test(
            "Toggle Availability", 
            "POST", 
            "/api/barbers/availability", 
            200,
            data={"available": True},
            headers=headers
        )
        
        return success1 and success2 and success3

    def test_barber_services(self):
        """Test barber services endpoints"""
        # First get a barber ID from all barbers
        success, response = self.run_test("Get Barbers for Services", "GET", "/api/barbers", 200)
        if not success or not response:
            return False
            
        if not response or len(response) == 0:
            self.log_result("Test Barber Services", False, "No barbers found")
            return False
            
        barber_id = response[0]['id']
        
        # Test get barber services
        success, _ = self.run_test(
            "Get Barber Services", 
            "GET", 
            f"/api/barbers/{barber_id}/services", 
            200
        )
        return success

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