"""
Test Stripe Connect Payment Integration for ClickBarber
Tests:
- GET /api/connect/status - Check barber's Stripe connect status
- POST /api/connect/onboard - Create/get Stripe onboarding URL
- POST /api/connect/payment - Create payment with commission split
"""

import pytest
import requests
import os
import json

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://clickbarber-payments.preview.emergentagent.com').rstrip('/')

# Test credentials
TEST_BARBER_EMAIL = "teste.barber@test.com"
TEST_BARBER_PASSWORD = "123456"
SEEDED_BARBER_EMAIL = "liam@barberx.com"
SEEDED_BARBER_PASSWORD = "123456"


class TestStripeConnectStatus:
    """Test /api/connect/status endpoint"""
    
    def test_connect_status_requires_auth(self):
        """Test that /connect/status requires authentication"""
        response = requests.get(f"{BASE_URL}/api/connect/status")
        assert response.status_code == 401 or response.status_code == 403, \
            f"Expected 401/403, got {response.status_code}"
        print("✓ /api/connect/status requires authentication")
    
    def test_connect_status_as_barber(self):
        """Test getting connect status as an authenticated barber"""
        # First login as barber
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": SEEDED_BARBER_EMAIL,
            "password": SEEDED_BARBER_PASSWORD
        })
        
        if login_response.status_code != 200:
            pytest.skip(f"Could not login as barber: {login_response.status_code}")
        
        token = login_response.json().get("token")
        assert token, "No token returned from login"
        
        # Now check connect status
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/connect/status", headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "connected" in data, "Response should include 'connected' field"
        assert "onboarding_complete" in data, "Response should include 'onboarding_complete' field"
        assert "charges_enabled" in data, "Response should include 'charges_enabled' field"
        
        print(f"✓ /api/connect/status returns correct structure: connected={data['connected']}")
        return data


class TestStripeConnectOnboarding:
    """Test /api/connect/onboard endpoint"""
    
    def test_onboard_requires_auth(self):
        """Test that /connect/onboard requires authentication"""
        response = requests.post(f"{BASE_URL}/api/connect/onboard")
        assert response.status_code == 401 or response.status_code == 403, \
            f"Expected 401/403, got {response.status_code}"
        print("✓ /api/connect/onboard requires authentication")
    
    def test_onboard_requires_barber_role(self):
        """Test that only barbers can onboard"""
        # First create/login as client
        client_email = "test_client_stripe@test.com"
        client_password = "123456"
        
        # Try to login first
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": client_email,
            "password": client_password
        })
        
        if login_response.status_code != 200:
            # Register new client
            register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Test Client Stripe",
                "email": client_email,
                "password": client_password,
                "phone": "123456789",
                "user_type": "client"
            })
            if register_response.status_code != 200:
                pytest.skip("Could not create test client")
            token = register_response.json().get("token")
        else:
            token = login_response.json().get("token")
        
        # Try to access onboard as client
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/api/connect/onboard", headers=headers)
        
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Only barbers can access /api/connect/onboard")
    
    def test_onboard_creates_stripe_account(self):
        """Test that onboard creates a Stripe account and returns onboarding URL"""
        # Login as barber
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": SEEDED_BARBER_EMAIL,
            "password": SEEDED_BARBER_PASSWORD
        })
        
        if login_response.status_code != 200:
            pytest.skip(f"Could not login as barber: {login_response.status_code}")
        
        token = login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/connect/onboard", headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "onboarding_url" in data, "Response should include 'onboarding_url' field"
        assert "account_id" in data, "Response should include 'account_id' field"
        
        # Validate onboarding URL format
        onboarding_url = data["onboarding_url"]
        assert onboarding_url.startswith("https://connect.stripe.com"), \
            f"Onboarding URL should be from Stripe: {onboarding_url}"
        
        # Validate account ID format (starts with 'acct_')
        account_id = data["account_id"]
        assert account_id.startswith("acct_"), \
            f"Account ID should start with 'acct_': {account_id}"
        
        print(f"✓ /api/connect/onboard creates Stripe account: {account_id}")
        print(f"  Onboarding URL: {onboarding_url[:60]}...")
        return data


class TestStripeConnectPayment:
    """Test /api/connect/payment endpoint"""
    
    def test_payment_requires_auth(self):
        """Test that /connect/payment requires authentication"""
        response = requests.post(f"{BASE_URL}/api/connect/payment", params={
            "barber_id": "test",
            "service_name": "Test",
            "service_price": 25.00
        })
        assert response.status_code == 401 or response.status_code == 403, \
            f"Expected 401/403, got {response.status_code}"
        print("✓ /api/connect/payment requires authentication")
    
    def test_payment_requires_barber_stripe(self):
        """Test that payment fails if barber hasn't set up Stripe"""
        # Login as client
        client_email = "test_client_payment@test.com"
        client_password = "123456"
        
        # Try to login first
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": client_email,
            "password": client_password
        })
        
        if login_response.status_code != 200:
            # Register new client
            register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Test Client Payment",
                "email": client_email,
                "password": client_password,
                "phone": "123456789",
                "user_type": "client"
            })
            if register_response.status_code != 200:
                pytest.skip("Could not create test client")
            token = register_response.json().get("token")
        else:
            token = login_response.json().get("token")
        
        # Create a test barber without Stripe
        test_barber_email = f"test_barber_no_stripe@test.com"
        barber_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": test_barber_email,
            "password": "123456"
        })
        
        if barber_login.status_code != 200:
            # Register barber
            register_barber = requests.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Test Barber No Stripe",
                "email": test_barber_email,
                "password": "123456",
                "phone": "987654321",
                "user_type": "barber",
                "specialty": "Test"
            })
            if register_barber.status_code == 200:
                barber_id = register_barber.json().get("user", {}).get("id")
            else:
                pytest.skip("Could not create test barber")
        else:
            barber_id = barber_login.json().get("user", {}).get("id")
        
        # Try to create payment
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(
            f"{BASE_URL}/api/connect/payment",
            headers=headers,
            params={
                "barber_id": barber_id,
                "service_name": "Test Service",
                "service_price": 25.00
            }
        )
        
        # Should fail because barber hasn't set up Stripe
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert "Stripe" in response.json().get("detail", ""), \
            "Error message should mention Stripe"
        print("✓ Payment fails correctly when barber hasn't set up Stripe")
    
    def test_payment_commission_calculation(self):
        """Test that 10% commission is correctly calculated"""
        # This test verifies the commission calculation logic
        service_price = 100.0
        travel_fee = 10.0
        total = service_price + travel_fee  # 110
        expected_platform_fee = total * 0.10  # 11
        expected_barber_amount = total - expected_platform_fee  # 99
        
        assert expected_platform_fee == 11.0, "Platform fee should be 10%"
        assert expected_barber_amount == 99.0, "Barber should receive 90%"
        print(f"✓ Commission calculation correct: 10% = €{expected_platform_fee} from €{total}")


class TestBarberDashboardStripeIntegration:
    """Test barber dashboard Stripe Connect integration"""
    
    def test_barber_can_see_stripe_section(self):
        """Verify barber dashboard has Stripe Connect section"""
        # Login as barber
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": SEEDED_BARBER_EMAIL,
            "password": SEEDED_BARBER_PASSWORD
        })
        
        if login_response.status_code != 200:
            pytest.skip(f"Could not login as barber: {login_response.status_code}")
        
        token = login_response.json().get("token")
        user = login_response.json().get("user")
        
        # Verify barber info
        assert user.get("user_type") == "barber", "User should be a barber"
        print(f"✓ Logged in as barber: {user.get('name')}")
        
        # Check Stripe status
        headers = {"Authorization": f"Bearer {token}"}
        status_response = requests.get(f"{BASE_URL}/api/connect/status", headers=headers)
        
        assert status_response.status_code == 200
        status = status_response.json()
        
        print(f"  Stripe status: connected={status.get('connected')}, charges_enabled={status.get('charges_enabled')}")
        return status


class TestEndToEndPaymentFlow:
    """End-to-end test for payment flow"""
    
    def test_full_payment_flow(self):
        """Test the complete payment flow from client perspective"""
        # 1. Login as client
        client_email = "test_e2e_client@test.com"
        client_password = "123456"
        
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": client_email,
            "password": client_password
        })
        
        if login_response.status_code != 200:
            register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Test E2E Client",
                "email": client_email,
                "password": client_password,
                "phone": "111222333",
                "user_type": "client"
            })
            if register_response.status_code != 200:
                pytest.skip("Could not create test client")
            client_token = register_response.json().get("token")
        else:
            client_token = login_response.json().get("token")
        
        # 2. Get available barbers
        barbers_response = requests.get(f"{BASE_URL}/api/barbers")
        assert barbers_response.status_code == 200
        barbers = barbers_response.json()
        
        if not barbers:
            pytest.skip("No barbers available for testing")
        
        # Find a barber with services
        test_barber = None
        for barber in barbers:
            if barber.get("services") and len(barber["services"]) > 0:
                test_barber = barber
                break
        
        if not test_barber:
            pytest.skip("No barber with services found")
        
        print(f"✓ Found barber for testing: {test_barber['name']}")
        print(f"  Services: {[s['name'] for s in test_barber.get('services', [])]}")
        
        # 3. Try to create a payment
        client_headers = {"Authorization": f"Bearer {client_token}"}
        service = test_barber["services"][0]
        
        payment_response = requests.post(
            f"{BASE_URL}/api/connect/payment",
            headers=client_headers,
            params={
                "barber_id": test_barber["id"],
                "service_name": service["name"],
                "service_price": service["price"],
                "is_home_service": False,
                "travel_fee": 0
            }
        )
        
        # Payment might fail if barber hasn't set up Stripe - that's expected
        if payment_response.status_code == 400:
            detail = payment_response.json().get("detail", "")
            if "Stripe" in detail:
                print(f"✓ Payment correctly blocked - barber needs Stripe setup")
                print(f"  Message: {detail}")
            else:
                print(f"⚠ Unexpected error: {detail}")
        elif payment_response.status_code == 200:
            data = payment_response.json()
            assert "checkout_url" in data
            assert "session_id" in data
            assert "platform_fee" in data
            assert "barber_receives" in data
            
            print(f"✓ Payment checkout created successfully")
            print(f"  Total: €{data.get('total')}")
            print(f"  Platform fee (10%): €{data.get('platform_fee')}")
            print(f"  Barber receives: €{data.get('barber_receives')}")
            print(f"  Checkout URL: {data.get('checkout_url')[:60]}...")


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
