"""
ClickBarber E2E API Tests
Tests: Authentication, Barbers, Queue, Home Service
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Basic API health check"""
    
    def test_api_is_accessible(self):
        """Test that API is responding"""
        response = requests.get(f"{BASE_URL}/api/barbers")
        assert response.status_code == 200, f"API not accessible: {response.status_code}"
        print("✓ API is accessible")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_register_client(self):
        """Test client registration"""
        unique_email = f"test_client_{int(time.time())}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Test Client",
            "email": unique_email,
            "password": "123456",
            "phone": "+353 87 123 4567",
            "user_type": "client"
        })
        
        # Allow 200 or 201 for success, 400 if already exists
        assert response.status_code in [200, 201, 400], f"Registration failed: {response.status_code} - {response.text}"
        
        if response.status_code in [200, 201]:
            data = response.json()
            assert "token" in data, "Token not returned"
            assert "user" in data, "User not returned"
            assert data["user"]["email"] == unique_email
            print(f"✓ Client registration successful: {unique_email}")
        else:
            print("✓ Client registration returned 400 (email may exist)")
    
    def test_register_barber(self):
        """Test barber registration"""
        unique_email = f"test_barber_{int(time.time())}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Test Barber",
            "email": unique_email,
            "password": "123456",
            "phone": "+353 87 234 5678",
            "user_type": "barber",
            "specialty": "Fade Specialist",
            "address": "Dublin City Center",
            "latitude": 53.3498,
            "longitude": -6.2603,
            "services": [
                {"id": "1", "name": "Corte", "price": 25, "duration": 30}
            ]
        })
        
        assert response.status_code in [200, 201, 400], f"Registration failed: {response.status_code}"
        
        if response.status_code in [200, 201]:
            data = response.json()
            assert "token" in data
            assert data["user"]["user_type"] == "barber"
            print(f"✓ Barber registration successful: {unique_email}")
        else:
            print("✓ Barber registration returned 400 (email may exist)")
    
    def test_login_with_email_password(self):
        """Test login with email/password - using seeded barber"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "liam@barberx.com",
            "password": "123456"
        })
        
        # If seeded barber exists, should succeed
        if response.status_code == 200:
            data = response.json()
            assert "token" in data, "Token not in response"
            assert "user" in data, "User not in response"
            assert data["user"]["email"] == "liam@barberx.com"
            print("✓ Login successful with seeded barber")
        else:
            # If no seed data, we try with test credentials
            print(f"⚠ Seeded barber login returned {response.status_code}, trying to create test user")
            
            # Create a test user
            register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Login Test User",
                "email": "login_test@test.com",
                "password": "123456",
                "phone": "+353 87 111 2222",
                "user_type": "client"
            })
            
            if register_response.status_code in [200, 201]:
                # Now try login
                login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
                    "email": "login_test@test.com",
                    "password": "123456"
                })
                assert login_response.status_code == 200, "Login failed after registration"
                print("✓ Login successful with new test user")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "liam@barberx.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401 for invalid creds, got {response.status_code}"
        print("✓ Invalid credentials correctly rejected with 401")
    
    def test_check_pin_status(self):
        """Test PIN status check endpoint"""
        response = requests.get(f"{BASE_URL}/api/auth/check-pin?email=liam@barberx.com")
        assert response.status_code in [200, 404], f"Check PIN failed: {response.status_code}"
        
        if response.status_code == 200:
            data = response.json()
            assert "pin_set" in data
            print(f"✓ PIN status check successful: pin_set={data['pin_set']}")
        else:
            print("✓ User not found (expected if no seed data)")
    
    def test_forgot_password(self):
        """Test forgot password flow"""
        response = requests.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": "liam@barberx.com"
        })
        assert response.status_code == 200, f"Forgot password failed: {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        # Test code may be returned for testing purposes
        if "test_code" in data:
            print(f"✓ Forgot password returned test code (expected for unverified domain)")
        else:
            print("✓ Forgot password email sent successfully")


class TestBarbers:
    """Barber listing and profile tests"""
    
    def test_get_barbers_list(self):
        """Test GET /api/barbers"""
        response = requests.get(f"{BASE_URL}/api/barbers")
        assert response.status_code == 200, f"Get barbers failed: {response.status_code}"
        
        barbers = response.json()
        assert isinstance(barbers, list), "Response should be a list"
        print(f"✓ Got {len(barbers)} barbers from API")
        
        # Check barber structure if we have data
        if len(barbers) > 0:
            barber = barbers[0]
            assert "id" in barber, "Barber should have id"
            assert "name" in barber, "Barber should have name"
            assert "user_type" in barber and barber["user_type"] == "barber"
            print(f"✓ Barber structure validated: {barber.get('name')}")
    
    def test_get_barbers_with_location(self):
        """Test GET /api/barbers with location params"""
        response = requests.get(f"{BASE_URL}/api/barbers?lat=53.3498&lon=-6.2603")
        assert response.status_code == 200
        
        barbers = response.json()
        # Check if distance is calculated
        if len(barbers) > 0:
            barber = barbers[0]
            # Distance should be included when lat/lon provided
            assert "distance" in barber, "Distance should be included"
            print(f"✓ Distance calculated: {barber.get('distance')} km")
    
    def test_get_barbers_online_only(self):
        """Test GET /api/barbers?online_only=true"""
        response = requests.get(f"{BASE_URL}/api/barbers?online_only=true")
        assert response.status_code == 200
        
        barbers = response.json()
        # All returned barbers should be online
        for barber in barbers:
            assert barber.get("is_online") == True, f"Barber {barber.get('name')} should be online"
        print(f"✓ Online filter working: {len(barbers)} online barbers")
    
    def test_get_single_barber(self):
        """Test GET /api/barbers/{barber_id}"""
        # First get list to find a barber id
        list_response = requests.get(f"{BASE_URL}/api/barbers")
        barbers = list_response.json()
        
        if len(barbers) == 0:
            pytest.skip("No barbers in database to test")
        
        barber_id = barbers[0]["id"]
        response = requests.get(f"{BASE_URL}/api/barbers/{barber_id}")
        assert response.status_code == 200, f"Get single barber failed: {response.status_code}"
        
        barber = response.json()
        assert barber["id"] == barber_id
        assert "reviews" in barber, "Single barber should include reviews"
        assert "queue" in barber, "Single barber should include queue"
        print(f"✓ Got single barber: {barber.get('name')}")
    
    def test_get_nonexistent_barber(self):
        """Test GET /api/barbers/{invalid_id}"""
        response = requests.get(f"{BASE_URL}/api/barbers/nonexistent-id-12345")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ 404 returned for nonexistent barber")


class TestBarberStatus:
    """Barber status update tests (requires auth)"""
    
    @pytest.fixture
    def barber_token(self):
        """Get barber auth token"""
        # Try seeded barber first
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "liam@barberx.com",
            "password": "123456"
        })
        
        if response.status_code == 200:
            return response.json()["token"]
        
        # Create test barber
        unique_email = f"test_status_barber_{int(time.time())}@test.com"
        reg_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Status Test Barber",
            "email": unique_email,
            "password": "123456",
            "phone": "+353 87 333 4444",
            "user_type": "barber"
        })
        
        if reg_response.status_code in [200, 201]:
            return reg_response.json()["token"]
        
        pytest.skip("Could not get barber token")
    
    def test_toggle_online_status(self, barber_token):
        """Test PUT /api/barbers/status"""
        headers = {"Authorization": f"Bearer {barber_token}"}
        
        # Set online
        response = requests.put(f"{BASE_URL}/api/barbers/status?is_online=true", headers=headers)
        assert response.status_code == 200, f"Status update failed: {response.status_code}"
        
        data = response.json()
        assert data["success"] == True
        assert data["is_online"] == True
        print("✓ Barber status set to online")
        
        # Set offline
        response = requests.put(f"{BASE_URL}/api/barbers/status?is_online=false", headers=headers)
        assert response.status_code == 200
        assert response.json()["is_online"] == False
        print("✓ Barber status set to offline")
    
    def test_toggle_home_service_status(self, barber_token):
        """Test PUT /api/barbers/home-service-status"""
        headers = {"Authorization": f"Bearer {barber_token}"}
        
        # Enable home service
        response = requests.put(
            f"{BASE_URL}/api/barbers/home-service-status?is_home_service_online=true",
            headers=headers
        )
        assert response.status_code == 200
        assert response.json()["is_home_service_online"] == True
        print("✓ Home service enabled")
        
        # Disable
        response = requests.put(
            f"{BASE_URL}/api/barbers/home-service-status?is_home_service_online=false",
            headers=headers
        )
        assert response.status_code == 200
        assert response.json()["is_home_service_online"] == False
        print("✓ Home service disabled")


class TestQueue:
    """Queue management tests"""
    
    @pytest.fixture
    def client_token(self):
        """Get client auth token"""
        # Create a test client
        unique_email = f"test_queue_client_{int(time.time())}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Queue Test Client",
            "email": unique_email,
            "password": "123456",
            "phone": "+353 87 555 6666",
            "user_type": "client"
        })
        
        if response.status_code in [200, 201]:
            return response.json()["token"]
        
        # Try login with existing
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "client@test.com",
            "password": "123456"
        })
        
        if login_response.status_code == 200:
            return login_response.json()["token"]
        
        pytest.skip("Could not get client token")
    
    def test_join_queue(self, client_token):
        """Test POST /api/queue/join"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # Get a barber to join queue
        barbers_response = requests.get(f"{BASE_URL}/api/barbers?online_only=true")
        barbers = barbers_response.json()
        
        if len(barbers) == 0:
            # Try all barbers
            barbers_response = requests.get(f"{BASE_URL}/api/barbers")
            barbers = barbers_response.json()
        
        if len(barbers) == 0:
            pytest.skip("No barbers available")
        
        barber_id = barbers[0]["id"]
        service = {"id": "1", "name": "Test Cut", "price": 25, "duration": 30}
        
        response = requests.post(
            f"{BASE_URL}/api/queue/join?barber_id={barber_id}&is_home_service=false&payment_method=cash&is_scheduled=false",
            headers=headers,
            json=service
        )
        
        # May get 400 if already in queue, that's fine
        assert response.status_code in [200, 201, 400], f"Join queue failed: {response.status_code} - {response.text}"
        
        if response.status_code in [200, 201]:
            data = response.json()
            assert data["success"] == True
            assert "queue_entry" in data
            print("✓ Joined queue successfully")
        else:
            print("✓ Already in queue (expected)")
    
    def test_get_my_position(self, client_token):
        """Test GET /api/queue/my-position"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        response = requests.get(f"{BASE_URL}/api/queue/my-position", headers=headers)
        assert response.status_code == 200, f"Get position failed: {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ Client has {len(data)} active queue entries")


class TestHomeServiceInterest:
    """Home service interest tests"""
    
    @pytest.fixture
    def client_token(self):
        """Get client auth token"""
        unique_email = f"test_home_client_{int(time.time())}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Home Service Test Client",
            "email": unique_email,
            "password": "123456",
            "phone": "+353 87 777 8888",
            "user_type": "client"
        })
        
        if response.status_code in [200, 201]:
            return response.json()["token"]
        
        pytest.skip("Could not create client for home service test")
    
    def test_register_home_service_interest(self, client_token):
        """Test POST /api/home-service-interest"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        response = requests.post(
            f"{BASE_URL}/api/home-service-interest",
            headers=headers,
            params={
                "client_address": "123 Test Street, Dublin",
                "client_latitude": 53.3498,
                "client_longitude": -6.2603,
                "service_name": "Corte",
                "service_price": 25
            }
        )
        
        # May get 400 if already has pending
        assert response.status_code in [200, 201, 400], f"Home service interest failed: {response.status_code}"
        
        if response.status_code in [200, 201]:
            data = response.json()
            assert data["success"] == True
            print(f"✓ Home service interest registered, {data.get('online_barbers', 0)} barbers notified")
        else:
            print("✓ Already has pending interest (expected)")


class TestStripeConnect:
    """Stripe Connect integration tests"""
    
    @pytest.fixture
    def barber_token(self):
        """Get barber auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "liam@barberx.com",
            "password": "123456"
        })
        
        if response.status_code == 200:
            return response.json()["token"]
        
        pytest.skip("Could not login as barber for Stripe tests")
    
    def test_stripe_connect_status_requires_auth(self):
        """Test GET /api/connect/status requires authentication"""
        response = requests.get(f"{BASE_URL}/api/connect/status")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Stripe status endpoint requires auth")
    
    def test_stripe_connect_status_authenticated(self, barber_token):
        """Test GET /api/connect/status with auth"""
        headers = {"Authorization": f"Bearer {barber_token}"}
        response = requests.get(f"{BASE_URL}/api/connect/status", headers=headers)
        
        assert response.status_code == 200, f"Stripe status failed: {response.status_code}"
        
        data = response.json()
        assert "connected" in data
        assert "charges_enabled" in data
        print(f"✓ Stripe status: connected={data['connected']}, charges_enabled={data['charges_enabled']}")
    
    def test_stripe_onboard_requires_auth(self):
        """Test POST /api/connect/onboard requires auth"""
        response = requests.post(f"{BASE_URL}/api/connect/onboard")
        assert response.status_code == 401
        print("✓ Stripe onboard endpoint requires auth")


class TestReviews:
    """Review system tests"""
    
    def test_get_barber_reviews(self):
        """Test GET /api/reviews/{barber_id}"""
        # Get a barber
        barbers = requests.get(f"{BASE_URL}/api/barbers").json()
        
        if len(barbers) == 0:
            pytest.skip("No barbers to test reviews")
        
        barber_id = barbers[0]["id"]
        response = requests.get(f"{BASE_URL}/api/reviews/{barber_id}")
        
        assert response.status_code == 200
        reviews = response.json()
        assert isinstance(reviews, list)
        print(f"✓ Got {len(reviews)} reviews for barber")


class TestHistory:
    """History endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "liam@barberx.com",
            "password": "123456"
        })
        
        if response.status_code == 200:
            return response.json()["token"]
        
        pytest.skip("Could not get auth token")
    
    def test_get_history(self, auth_token):
        """Test GET /api/history"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/history", headers=headers)
        
        assert response.status_code == 200
        history = response.json()
        assert isinstance(history, list)
        print(f"✓ Got {len(history)} history entries")


class TestSeedData:
    """Seed data tests"""
    
    def test_seed_endpoint(self):
        """Test POST /api/seed"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        
        data = response.json()
        # Either seeded or already seeded
        assert "message" in data or "barbers" in data
        print(f"✓ Seed endpoint response: {data.get('message', 'Seeded')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
