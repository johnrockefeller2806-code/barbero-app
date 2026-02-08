from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import jwt
import math
import random
import string
import base64
import resend
import stripe

# Stripe integration
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

JWT_SECRET = os.environ.get('JWT_SECRET', 'barberx-secret-key-2024')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
PLATFORM_FEE_PERCENT = 10  # 10% commission for ClickBarber

# Initialize Stripe
stripe.api_key = STRIPE_API_KEY

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ==================== SUBSCRIPTION PLANS ====================
SUBSCRIPTION_PLANS = {
    "basic": {
        "id": "basic",
        "name": "Plano Básico",
        "price": 19.90,
        "currency": "eur",
        "features": ["Perfil na plataforma", "Até 50 clientes/mês", "Suporte por email"],
        "trial_days": 14
    },
    "premium": {
        "id": "premium", 
        "name": "Plano Premium",
        "price": 39.90,
        "currency": "eur",
        "features": ["Perfil destacado", "Clientes ilimitados", "Relatórios avançados", "Suporte prioritário"],
        "trial_days": 14
    }
}

REFERRAL_BONUS = 5.0  # €5 for both referrer and referred

# ==================== MODELS ====================

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    user_type: str  # 'client' or 'barber'
    # Barber specific fields
    specialty: Optional[str] = None
    services: Optional[List[dict]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    photo_url: Optional[str] = None
    instagram: Optional[str] = None  # Instagram username
    # Home service fields
    offers_home_service: bool = False
    home_service_fee_per_km: float = 1.0  # € per km
    # Referral
    referral_code: Optional[str] = None  # Code used during registration

class UserLogin(BaseModel):
    email: str
    password: str

class PinLogin(BaseModel):
    email: str
    pin: str

class SetPin(BaseModel):
    pin: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    email: str
    code: str
    new_password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    user_type: str
    photo_url: Optional[str] = None
    instagram: Optional[str] = None  # Instagram username
    # PIN security
    pin: Optional[str] = None  # 6-digit PIN (hashed)
    pin_set: bool = False  # Whether user has set a PIN
    # Password reset
    reset_code: Optional[str] = None
    reset_code_expires: Optional[str] = None
    # Barber fields
    specialty: Optional[str] = None
    services: Optional[List[dict]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    is_online: bool = False
    is_home_service_online: bool = False  # Online specifically for home service
    rating: float = 5.0
    total_reviews: int = 0
    # Home service fields
    offers_home_service: bool = False
    home_service_fee_per_km: float = 1.0  # €1 per km
    # Referral system
    referral_code: Optional[str] = None  # User's own code to share
    referred_by: Optional[str] = None  # Who referred this user
    referral_balance: float = 0.0  # Earned from referrals
    # Subscription (barbers only)
    subscription_plan: Optional[str] = None
    subscription_status: Optional[str] = None  # active, trial, expired
    subscription_end: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QueueEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    barber_id: str
    service: dict
    status: str = "waiting"  # waiting, in_progress, completed, cancelled
    position: int = 0
    estimated_wait: int = 0  # minutes
    # Scheduling fields
    is_scheduled: bool = False
    scheduled_date: Optional[str] = None  # YYYY-MM-DD
    scheduled_time: Optional[str] = None  # HH:MM
    # Home service fields
    is_home_service: bool = False
    client_address: Optional[str] = None
    client_latitude: Optional[float] = None
    client_longitude: Optional[float] = None
    distance_km: float = 0
    travel_fee: float = 0
    total_price: float = 0
    # Client live tracking fields
    client_live_latitude: Optional[float] = None
    client_live_longitude: Optional[float] = None
    client_is_moving: bool = False
    client_last_update: Optional[str] = None
    # Barber live tracking fields (for home service)
    barber_live_latitude: Optional[float] = None
    barber_live_longitude: Optional[float] = None
    barber_is_moving: bool = False
    barber_last_update: Optional[str] = None
    # Payment
    payment_method: str = "cash"  # cash or card
    # Tips
    tip_amount: float = 0
    tip_payment_method: Optional[str] = None  # cash or card
    tip_given: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    barber_id: str
    queue_entry_id: Optional[str] = None  # Link to the service
    rating: int
    comment: Optional[str] = None
    service_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Home Service Interest model
class HomeServiceInterest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    client_phone: Optional[str] = None
    barber_id: str
    service_name: Optional[str] = None
    service_price: Optional[float] = None
    client_address: str
    client_latitude: Optional[float] = None
    client_longitude: Optional[float] = None
    distance_km: float = 0
    status: str = "pending"  # pending, accepted, rejected
    is_read: bool = False  # For notification
    barber_response: Optional[str] = None  # Message from barber
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Payment transaction model
class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    amount: float
    currency: str = "eur"
    payment_type: str  # "service", "subscription"
    session_id: str
    payment_status: str = "pending"  # pending, paid, failed, expired
    metadata: Optional[Dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Referral model
class Referral(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_id: str
    referred_id: str
    referrer_bonus: float = REFERRAL_BONUS
    referred_bonus: float = REFERRAL_BONUS
    status: str = "pending"  # pending, credited
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPERS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: str, user_type: str) -> str:
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km using Haversine formula"""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def generate_referral_code(length: int = 8) -> str:
    """Generate a unique referral code"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(input: UserRegister):
    existing = await db.users.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = input.model_dump()
    user_data["password"] = hash_password(input.password)
    
    # Generate unique referral code for user
    referral_code = generate_referral_code()
    while await db.users.find_one({"referral_code": referral_code}):
        referral_code = generate_referral_code()
    user_data["referral_code"] = referral_code
    
    # Handle referral if code provided
    referred_by = None
    if input.referral_code:
        referrer = await db.users.find_one({"referral_code": input.referral_code})
        if referrer:
            referred_by = referrer["id"]
            user_data["referred_by"] = referred_by
            user_data["referral_balance"] = REFERRAL_BONUS  # Give bonus to new user
    
    # For barbers, start with trial subscription
    if input.user_type == "barber":
        user_data["subscription_plan"] = "basic"
        user_data["subscription_status"] = "trial"
        user_data["subscription_end"] = (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
    
    user = User(**user_data)
    doc = user.model_dump()
    doc["password"] = user_data["password"]
    doc["created_at"] = doc["created_at"].isoformat()
    if doc.get("subscription_end"):
        doc["subscription_end"] = user_data.get("subscription_end")
    
    await db.users.insert_one(doc)
    
    # Credit referrer if applicable
    if referred_by:
        await db.users.update_one(
            {"id": referred_by},
            {"$inc": {"referral_balance": REFERRAL_BONUS}}
        )
        # Save referral record
        referral = Referral(
            referrer_id=referred_by,
            referred_id=user.id,
            status="credited"
        )
        ref_doc = referral.model_dump()
        ref_doc["created_at"] = ref_doc["created_at"].isoformat()
        await db.referrals.insert_one(ref_doc)
    
    token = create_token(user.id, user.user_type)
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type": user.user_type,
            "photo_url": user.photo_url,
            "referral_code": referral_code,
            "referral_balance": user_data.get("referral_balance", 0)
        }
    }

@api_router.post("/auth/login")
async def login(input: UserLogin):
    user = await db.users.find_one({"email": input.email}, {"_id": 0})
    if not user or user["password"] != hash_password(input.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["user_type"])
    del user["password"]
    
    if isinstance(user.get("created_at"), str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    
    # Check if PIN is set
    pin_set = user.get("pin_set", False)
    
    return {"token": token, "user": user, "pin_set": pin_set}

@api_router.post("/auth/login-pin")
async def login_with_pin(input: PinLogin):
    """Login with 6-digit PIN (quick access)"""
    user = await db.users.find_one({"email": input.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    if not user.get("pin_set") or not user.get("pin"):
        raise HTTPException(status_code=400, detail="PIN not set. Please login with password first.")
    
    if user["pin"] != hash_password(input.pin):
        raise HTTPException(status_code=401, detail="Invalid PIN")
    
    token = create_token(user["id"], user["user_type"])
    del user["password"]
    if "pin" in user:
        del user["pin"]
    
    if isinstance(user.get("created_at"), str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    
    return {"token": token, "user": user}

@api_router.post("/auth/set-pin")
async def set_pin(input: SetPin, user: dict = Depends(get_current_user)):
    """Set or update 6-digit PIN"""
    if len(input.pin) != 6 or not input.pin.isdigit():
        raise HTTPException(status_code=400, detail="PIN must be exactly 6 digits")
    
    hashed_pin = hash_password(input.pin)
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"pin": hashed_pin, "pin_set": True}}
    )
    
    return {"success": True, "message": "PIN set successfully"}

@api_router.get("/auth/check-pin")
async def check_pin_status(email: str):
    """Check if user has PIN set"""
    user = await db.users.find_one({"email": email}, {"_id": 0, "pin_set": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"pin_set": user.get("pin_set", False)}

@api_router.post("/auth/forgot-password")
async def forgot_password(input: ForgotPassword):
    """Send password reset code via email"""
    user = await db.users.find_one({"email": input.email}, {"_id": 0})
    if not user:
        # Don't reveal if email exists or not for security
        return {"success": True, "message": "If the email exists, a reset code will be sent"}
    
    # Generate 6-digit code
    reset_code = ''.join(random.choices(string.digits, k=6))
    reset_expires = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
    
    # Save code to database
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"reset_code": reset_code, "reset_code_expires": reset_expires}}
    )
    
    email_sent = False
    
    # Try to send email via Resend
    if RESEND_API_KEY:
        try:
            logo_url = "https://customer-assets.emergentagent.com/job_ocular-insight/artifacts/58zigzi9_WhatsApp%20Image%202026-02-07%20at%2017.52.20.jpeg"
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
                <!-- Header com Logo - Fundo Preto -->
                <div style="background: #000000; padding: 40px; text-align: center;">
                    <img src="{logo_url}" alt="ClickBarber" style="height: 120px;" />
                </div>
                <!-- Content - Fundo Preto -->
                <div style="background: #000000; padding: 30px;">
                    <h2 style="color: #F59E0B; margin-top: 0; font-size: 24px;">Recuperação de Senha</h2>
                    <p style="color: #E4E4E7; font-size: 16px;">Olá {user['name']},</p>
                    <p style="color: #A1A1AA; font-size: 16px;">Seu código de recuperação é:</p>
                    <div style="background: #1a1a1a; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #333333;">
                        <span style="color: #F59E0B; font-size: 40px; font-weight: bold; letter-spacing: 10px;">{reset_code}</span>
                    </div>
                </div>
                <!-- Footer - Fundo Cinza Claro -->
                <div style="background: #E5E5E5; padding: 30px; text-align: left;">
                    <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">⏱️ Este código expira em 15 minutos.</p>
                    <p style="color: #666666; font-size: 14px; margin: 0 0 25px 0;">Se você não solicitou esta recuperação, ignore este email.</p>
                    <hr style="border: none; border-top: 1px solid #CCCCCC; margin: 20px 0;" />
                    <p style="color: #888888; font-size: 14px; text-align: center; margin: 0 0 15px 0;">
                        ClickBarber - Dublin, Ireland 🇮🇪<br/>
                        Seu marketplace de barbeiros
                    </p>
                    <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
                        Você recebeu este e-mail porque está cadastrado na ClickBarber com o endereço {input.email}
                    </p>
                </div>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [input.email],
                "subject": "ClickBarber - Código de Recuperação de Senha",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
            
        except Exception as e:
            logging.error(f"Failed to send email: {str(e)}")
            # Continue without raising - we'll return the code for testing
    
    # In development/testing mode, return the code
    # In production, you'd want to check environment and only return success
    response = {
        "success": True, 
        "message": "Reset code sent to your email" if email_sent else "Code generated (check email or use code below for testing)"
    }
    
    # For testing purposes, include the code (remove this in production)
    if not email_sent:
        response["test_code"] = reset_code
        response["note"] = "Email service needs verified domain. Use this code for testing."
    
    return response

@api_router.post("/auth/reset-password")
async def reset_password(input: ResetPassword):
    """Reset password using code from email"""
    user = await db.users.find_one({"email": input.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check code
    if not user.get("reset_code") or user["reset_code"] != input.code:
        raise HTTPException(status_code=400, detail="Invalid reset code")
    
    # Check expiration
    if user.get("reset_code_expires"):
        expires = datetime.fromisoformat(user["reset_code_expires"])
        if datetime.now(timezone.utc) > expires:
            raise HTTPException(status_code=400, detail="Reset code expired")
    
    # Update password
    new_password_hash = hash_password(input.new_password)
    
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {"password": new_password_hash},
            "$unset": {"reset_code": "", "reset_code_expires": ""}
        }
    )
    
    return {"success": True, "message": "Password reset successfully"}

# Google OAuth Callback
class GoogleAuthData(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    session_token: str

@api_router.post("/auth/google-callback")
async def google_callback(data: GoogleAuthData, response: Response):
    """Handle Google OAuth callback - create/update user and set session"""
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": data.email}, {"_id": 0})
    
    if existing_user:
        # Update existing user with Google data
        await db.users.update_one(
            {"email": data.email},
            {"$set": {
                "google_id": data.id,
                "photo_url": data.picture if data.picture else existing_user.get("photo_url"),
                "name": data.name if not existing_user.get("name") else existing_user["name"]
            }}
        )
        user = await db.users.find_one({"email": data.email}, {"_id": 0, "password": 0, "pin": 0})
    else:
        # Create new user as client by default
        user_id = str(uuid.uuid4())
        new_user = {
            "id": user_id,
            "google_id": data.id,
            "email": data.email,
            "name": data.name,
            "phone": "",
            "user_type": "client",  # Default to client, can be changed later
            "photo_url": data.picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_online": False,
            "referral_code": generate_referral_code(),
            "referral_balance": 0
        }
        await db.users.insert_one(new_user)
        user = {k: v for k, v in new_user.items() if k not in ["password", "pin", "_id"]}
    
    # Store session
    session_expires = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"user_id": user["id"]},
        {"$set": {
            "session_token": data.session_token,
            "expires_at": session_expires,
            "created_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )
    
    # Set httpOnly cookie
    response.set_cookie(
        key="session_token",
        value=data.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60  # 7 days
    )
    
    # Generate JWT token for compatibility with existing system
    token = create_token(user["id"], user["user_type"])
    
    return {"token": token, "user": user}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

# ==================== BARBER ROUTES ====================

@api_router.get("/barbers")
async def get_barbers(lat: Optional[float] = None, lon: Optional[float] = None, online_only: bool = False):
    query = {"user_type": "barber"}
    if online_only:
        query["is_online"] = True
    
    barbers = await db.users.find(query, {"_id": 0, "password": 0}).to_list(100)
    
    for b in barbers:
        if isinstance(b.get("created_at"), str):
            b["created_at"] = datetime.fromisoformat(b["created_at"])
        # Calculate distance if coordinates provided
        if lat and lon and b.get("latitude") and b.get("longitude"):
            b["distance"] = round(calculate_distance(lat, lon, b["latitude"], b["longitude"]), 1)
        else:
            b["distance"] = None
        # Get queue count
        queue_count = await db.queue.count_documents({"barber_id": b["id"], "status": "waiting"})
        b["queue_count"] = queue_count
    
    # Sort by distance if provided
    if lat and lon:
        barbers = sorted(barbers, key=lambda x: x.get("distance") or 9999)
    
    return barbers

@api_router.get("/barbers/{barber_id}")
async def get_barber(barber_id: str):
    barber = await db.users.find_one({"id": barber_id, "user_type": "barber"}, {"_id": 0, "password": 0})
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    if isinstance(barber.get("created_at"), str):
        barber["created_at"] = datetime.fromisoformat(barber["created_at"])
    
    # Get reviews
    reviews = await db.reviews.find({"barber_id": barber_id}, {"_id": 0}).to_list(50)
    for r in reviews:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
    barber["reviews"] = reviews
    
    # Get queue
    queue = await db.queue.find({"barber_id": barber_id, "status": "waiting"}, {"_id": 0}).sort("position", 1).to_list(50)
    barber["queue"] = queue
    
    return barber

@api_router.put("/barbers/status")
async def update_status(is_online: bool, user: dict = Depends(get_current_user)):
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can update status")
    
    await db.users.update_one({"id": user["id"]}, {"$set": {"is_online": is_online}})
    return {"success": True, "is_online": is_online}

@api_router.put("/barbers/home-service-status")
async def update_home_service_status(is_home_service_online: bool, user: dict = Depends(get_current_user)):
    """Toggle barber availability for home service"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can update status")
    
    await db.users.update_one(
        {"id": user["id"]}, 
        {"$set": {"is_home_service_online": is_home_service_online, "offers_home_service": is_home_service_online}}
    )
    return {"success": True, "is_home_service_online": is_home_service_online}

@api_router.put("/barbers/profile")
async def update_barber_profile(
    specialty: Optional[str] = None,
    services: Optional[List[dict]] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    address: Optional[str] = None,
    photo_url: Optional[str] = None,
    instagram: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can update profile")
    
    update = {}
    if specialty: update["specialty"] = specialty
    if services: update["services"] = services
    if latitude: update["latitude"] = latitude
    if longitude: update["longitude"] = longitude
    if address: update["address"] = address
    if photo_url: update["photo_url"] = photo_url
    if instagram is not None: update["instagram"] = instagram
    
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
    
    return {"success": True}

@api_router.post("/barbers/upload-photo")
async def upload_barber_photo(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """Upload profile photo for barber"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can upload photos")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read and encode file
    contents = await file.read()
    
    # Check file size (max 5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 5MB")
    
    # Convert to base64 data URL
    base64_image = base64.b64encode(contents).decode('utf-8')
    photo_url = f"data:{file.content_type};base64,{base64_image}"
    
    # Update user photo
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"photo_url": photo_url}}
    )
    
    return {"success": True, "photo_url": photo_url}

# ==================== QUEUE ROUTES ====================

@api_router.post("/queue/join")
async def join_queue(
    barber_id: str, 
    service: dict, 
    is_home_service: bool = False,
    client_address: Optional[str] = None,
    client_latitude: Optional[float] = None,
    client_longitude: Optional[float] = None,
    payment_method: str = "cash",
    is_scheduled: bool = False,
    scheduled_date: Optional[str] = None,
    scheduled_time: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can join queue")
    
    # Check if already in queue (only for non-scheduled)
    if not is_scheduled:
        existing = await db.queue.find_one({
            "client_id": user["id"],
            "barber_id": barber_id,
            "status": "waiting",
            "is_scheduled": False
        })
        if existing:
            raise HTTPException(status_code=400, detail="Already in queue for this barber")
    
    # Get barber info for home service calculation
    barber = await db.users.find_one({"id": barber_id}, {"_id": 0})
    
    distance_km = 0
    travel_fee = 0
    total_price = service.get("price", 0)
    
    if is_home_service:
        if not barber.get("offers_home_service"):
            raise HTTPException(status_code=400, detail="This barber does not offer home service")
        if not client_latitude or not client_longitude:
            raise HTTPException(status_code=400, detail="Client location required for home service")
        
        # Calculate distance
        distance_km = calculate_distance(
            barber.get("latitude", 0), barber.get("longitude", 0),
            client_latitude, client_longitude
        )
        travel_fee = round(distance_km * barber.get("home_service_fee_per_km", 2.0), 2)
        total_price = service.get("price", 0) + travel_fee
    
    # Get position (scheduled appointments don't have queue position)
    position = 0
    if not is_scheduled:
        last_in_queue = await db.queue.find_one(
            {"barber_id": barber_id, "status": "waiting", "is_scheduled": False},
            sort=[("position", -1)]
        )
        position = (last_in_queue["position"] + 1) if last_in_queue else 1
    
    entry = QueueEntry(
        client_id=user["id"],
        client_name=user["name"],
        barber_id=barber_id,
        service=service,
        position=position,
        estimated_wait=position * service.get("duration", 30) if not is_scheduled else 0,
        is_home_service=is_home_service,
        client_address=client_address,
        client_latitude=client_latitude,
        client_longitude=client_longitude,
        distance_km=round(distance_km, 1),
        travel_fee=travel_fee,
        total_price=total_price,
        payment_method=payment_method,
        is_scheduled=is_scheduled,
        scheduled_date=scheduled_date,
        scheduled_time=scheduled_time
    )
    
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.queue.insert_one(doc)
    
    return {"success": True, "queue_entry": entry.model_dump()}

@api_router.get("/queue/my-position")
async def get_my_position(user: dict = Depends(get_current_user)):
    entries = await db.queue.find(
        {"client_id": user["id"], "status": {"$in": ["waiting", "in_progress"]}},
        {"_id": 0}
    ).to_list(10)
    
    for e in entries:
        if isinstance(e.get("created_at"), str):
            e["created_at"] = datetime.fromisoformat(e["created_at"])
        # Get barber info including location
        barber = await db.users.find_one(
            {"id": e["barber_id"]}, 
            {"_id": 0, "name": 1, "photo_url": 1, "address": 1, "latitude": 1, "longitude": 1, "phone": 1}
        )
        e["barber"] = barber
    
    return entries

@api_router.get("/queue/barber")
async def get_barber_queue(user: dict = Depends(get_current_user)):
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can view their queue")
    
    queue = await db.queue.find(
        {"barber_id": user["id"], "status": {"$in": ["waiting", "in_progress"]}},
        {"_id": 0}
    ).sort("position", 1).to_list(50)
    
    for q in queue:
        if isinstance(q.get("created_at"), str):
            q["created_at"] = datetime.fromisoformat(q["created_at"])
    
    return queue

@api_router.put("/queue/{entry_id}/status")
async def update_queue_status(entry_id: str, status: str, user: dict = Depends(get_current_user)):
    entry = await db.queue.find_one({"id": entry_id})
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    # Check permissions
    if user["user_type"] == "barber" and entry["barber_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your queue")
    if user["user_type"] == "client" and entry["client_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your entry")
    
    await db.queue.update_one({"id": entry_id}, {"$set": {"status": status}})
    
    # If completed or cancelled, update positions
    if status in ["completed", "cancelled"]:
        await db.queue.update_many(
            {"barber_id": entry["barber_id"], "status": "waiting", "position": {"$gt": entry["position"]}},
            {"$inc": {"position": -1}}
        )
    
    return {"success": True}

@api_router.delete("/queue/{entry_id}")
async def leave_queue(entry_id: str, user: dict = Depends(get_current_user)):
    entry = await db.queue.find_one({"id": entry_id, "client_id": user["id"]})
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    await db.queue.delete_one({"id": entry_id})
    
    # Update positions
    await db.queue.update_many(
        {"barber_id": entry["barber_id"], "status": "waiting", "position": {"$gt": entry["position"]}},
        {"$inc": {"position": -1}}
    )
    
    return {"success": True}

# ==================== LIVE TRACKING ROUTES ====================

@api_router.put("/queue/update-location")
async def update_client_location(
    latitude: float,
    longitude: float,
    is_moving: bool = True,
    user: dict = Depends(get_current_user)
):
    """Update client's live location for tracking"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can update location")
    
    # Update all active queue entries for this client
    result = await db.queue.update_many(
        {"client_id": user["id"], "status": {"$in": ["waiting", "in_progress"]}},
        {
            "$set": {
                "client_live_latitude": latitude,
                "client_live_longitude": longitude,
                "client_is_moving": is_moving,
                "client_last_update": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"success": True, "updated": result.modified_count}

@api_router.put("/queue/stop-tracking")
async def stop_client_tracking(user: dict = Depends(get_current_user)):
    """Stop tracking client location (arrived at destination)"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can stop tracking")
    
    await db.queue.update_many(
        {"client_id": user["id"], "status": {"$in": ["waiting", "in_progress"]}},
        {
            "$set": {
                "client_is_moving": False,
                "client_last_update": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"success": True}

# ==================== BARBER TRACKING ROUTES ====================

@api_router.put("/queue/barber-location")
async def update_barber_location(
    entry_id: str,
    latitude: float,
    longitude: float,
    is_moving: bool = True,
    user: dict = Depends(get_current_user)
):
    """Update barber's live location for home service tracking"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can update location")
    
    # Update specific queue entry
    result = await db.queue.update_one(
        {"id": entry_id, "barber_id": user["id"], "is_home_service": True},
        {
            "$set": {
                "barber_live_latitude": latitude,
                "barber_live_longitude": longitude,
                "barber_is_moving": is_moving,
                "barber_last_update": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"success": True, "updated": result.modified_count}

@api_router.put("/queue/barber-stop-tracking/{entry_id}")
async def stop_barber_tracking(entry_id: str, user: dict = Depends(get_current_user)):
    """Stop tracking barber location (arrived at client)"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can stop tracking")
    
    await db.queue.update_one(
        {"id": entry_id, "barber_id": user["id"]},
        {
            "$set": {
                "barber_is_moving": False,
                "barber_last_update": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"success": True}

# ==================== SCHEDULING ROUTES ====================

@api_router.get("/queue/schedules")
async def get_schedules(user: dict = Depends(get_current_user)):
    """Get scheduled appointments for barber or client"""
    if user["user_type"] == "barber":
        query = {"barber_id": user["id"], "is_scheduled": True, "status": {"$in": ["waiting", "in_progress"]}}
    else:
        query = {"client_id": user["id"], "is_scheduled": True, "status": {"$in": ["waiting", "in_progress"]}}
    
    schedules = await db.queue.find(query, {"_id": 0}).sort([("scheduled_date", 1), ("scheduled_time", 1)]).to_list(100)
    
    for s in schedules:
        if isinstance(s.get("created_at"), str):
            s["created_at"] = datetime.fromisoformat(s["created_at"])
        # Get additional info
        if user["user_type"] == "barber":
            client = await db.users.find_one({"id": s["client_id"]}, {"_id": 0, "name": 1, "phone": 1, "photo_url": 1})
            s["client_info"] = client
        else:
            barber = await db.users.find_one({"id": s["barber_id"]}, {"_id": 0, "name": 1, "phone": 1, "photo_url": 1, "address": 1})
            s["barber_info"] = barber
    
    return schedules

@api_router.get("/queue/track/{entry_id}")
async def get_tracking_info(entry_id: str, user: dict = Depends(get_current_user)):
    """Get live tracking info for a queue entry"""
    entry = await db.queue.find_one({"id": entry_id}, {"_id": 0})
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # Check permissions
    if user["user_type"] == "client" and entry["client_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your entry")
    if user["user_type"] == "barber" and entry["barber_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your entry")
    
    return {
        "id": entry["id"],
        "barber_live_latitude": entry.get("barber_live_latitude"),
        "barber_live_longitude": entry.get("barber_live_longitude"),
        "barber_is_moving": entry.get("barber_is_moving", False),
        "barber_last_update": entry.get("barber_last_update"),
        "client_live_latitude": entry.get("client_live_latitude"),
        "client_live_longitude": entry.get("client_live_longitude"),
        "client_is_moving": entry.get("client_is_moving", False),
        "client_last_update": entry.get("client_last_update"),
        "status": entry["status"]
    }

# ==================== TIPS ROUTES ====================

@api_router.post("/tips")
async def give_tip(
    queue_entry_id: str,
    amount: float,
    payment_method: str = "cash",  # cash or card
    user: dict = Depends(get_current_user)
):
    """Give a tip to the barber after service"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can give tips")
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Tip amount must be positive")
    
    if payment_method not in ["cash", "card"]:
        raise HTTPException(status_code=400, detail="Payment method must be 'cash' or 'card'")
    
    # Find the queue entry
    entry = await db.queue.find_one({"id": queue_entry_id, "client_id": user["id"]})
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    if entry.get("tip_given"):
        raise HTTPException(status_code=400, detail="Tip already given for this service")
    
    # Update the queue entry with tip info
    await db.queue.update_one(
        {"id": queue_entry_id},
        {
            "$set": {
                "tip_amount": amount,
                "tip_payment_method": payment_method,
                "tip_given": True
            }
        }
    )
    
    return {"success": True, "message": f"Tip of €{amount} given successfully"}

@api_router.get("/tips/barber")
async def get_barber_tips(user: dict = Depends(get_current_user)):
    """Get all tips received by barber"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can view their tips")
    
    # Get all completed entries with tips
    tips = await db.queue.find(
        {"barber_id": user["id"], "tip_given": True},
        {"_id": 0, "id": 1, "client_name": 1, "tip_amount": 1, "tip_payment_method": 1, "service": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(100)
    
    total_tips = sum(t.get("tip_amount", 0) for t in tips)
    today = datetime.now(timezone.utc).date()
    today_tips = sum(t.get("tip_amount", 0) for t in tips 
                     if isinstance(t.get("created_at"), str) and 
                     datetime.fromisoformat(t["created_at"]).date() == today)
    
    return {
        "tips": tips,
        "total_tips": round(total_tips, 2),
        "today_tips": round(today_tips, 2),
        "tips_count": len(tips)
    }

@api_router.get("/queue/completed")
async def get_completed_services(user: dict = Depends(get_current_user)):
    """Get completed services for client to give tips/reviews"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can view their completed services")
    
    # Get completed services that haven't been tipped yet
    completed = await db.queue.find(
        {"client_id": user["id"], "status": "completed"},
        {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    
    # Add barber info
    for entry in completed:
        barber = await db.users.find_one({"id": entry["barber_id"]}, {"_id": 0, "name": 1, "photo_url": 1})
        entry["barber"] = barber
    
    return completed

# ==================== HOME SERVICE INTEREST ROUTES ====================

@api_router.post("/home-service-interest")
async def register_home_service_interest(
    client_address: str,
    client_latitude: Optional[float] = None,
    client_longitude: Optional[float] = None,
    service_name: Optional[str] = None,
    service_price: Optional[float] = None,
    user: dict = Depends(get_current_user)
):
    """Register client interest in home service - broadcasts to ALL barbers online for home service"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can register interest")
    
    # Check if already has pending interest
    existing = await db.home_service_interests.find_one({
        "client_id": user["id"],
        "status": "pending"
    })
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending request. Wait for a barber to respond.")
    
    # Get full user info to include photo
    client_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    
    interest = HomeServiceInterest(
        client_id=user["id"],
        client_name=user["name"],
        client_phone=user.get("phone"),
        barber_id="broadcast",  # Special value for global broadcast
        service_name=service_name,
        service_price=service_price,
        client_address=client_address,
        client_latitude=client_latitude,
        client_longitude=client_longitude,
        distance_km=0  # Will be calculated per barber
    )
    
    doc = interest.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["client_photo_url"] = client_user.get("photo_url")  # Add client photo
    await db.home_service_interests.insert_one(doc)
    
    # Count barbers online for home service
    online_barbers = await db.users.count_documents({"user_type": "barber", "is_home_service_online": True})
    
    return {
        "success": True, 
        "message": f"Interest registered! {online_barbers} barber(s) will be notified.",
        "online_barbers": online_barbers
    }

@api_router.get("/home-service-interest/barber")
async def get_barber_home_service_interests(user: dict = Depends(get_current_user)):
    """Get all home service interests - shows global requests if barber is online for home service"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can view interests")
    
    # Check if barber is online for home service
    barber = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    
    if not barber.get("is_home_service_online"):
        return {
            "interests": [],
            "unread_count": 0,
            "total_count": 0,
            "is_home_service_online": False,
            "message": "Ative 'Online para Home Service' para ver clientes interessados"
        }
    
    # Get all broadcast interests (pending)
    interests = await db.home_service_interests.find(
        {"barber_id": "broadcast", "status": "pending"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    # Calculate distance for each client
    barber_lat = barber.get("latitude", 0)
    barber_lng = barber.get("longitude", 0)
    
    for i in interests:
        if i.get("client_latitude") and i.get("client_longitude"):
            i["distance_km"] = round(calculate_distance(
                barber_lat, barber_lng,
                i["client_latitude"], i["client_longitude"]
            ), 1)
        else:
            i["distance_km"] = 0
    
    # Sort by distance
    interests.sort(key=lambda x: x.get("distance_km", 999))
    
    # Count unread (new in last hour)
    from datetime import timedelta
    one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
    unread_count = sum(1 for i in interests 
                       if isinstance(i.get("created_at"), str) and 
                       datetime.fromisoformat(i["created_at"]) > one_hour_ago)
    
    return {
        "interests": interests,
        "unread_count": unread_count,
        "total_count": len(interests),
        "is_home_service_online": True
    }

@api_router.put("/home-service-interest/{interest_id}/accept")
async def accept_home_service_interest(
    interest_id: str,
    user: dict = Depends(get_current_user)
):
    """Barber accepts a home service request"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can accept")
    
    interest = await db.home_service_interests.find_one({"id": interest_id}, {"_id": 0})
    if not interest:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    if interest["status"] != "pending":
        raise HTTPException(status_code=400, detail="This request was already taken by another barber")
    
    # Update the interest - assign to this barber
    await db.home_service_interests.update_one(
        {"id": interest_id},
        {
            "$set": {
                "status": "accepted",
                "barber_id": user["id"],
                "accepted_by": user["name"],
                "accepted_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {
        "success": True, 
        "message": "You accepted the request! Contact the client.",
        "client_phone": interest.get("client_phone"),
        "client_address": interest.get("client_address")
    }

@api_router.put("/home-service-interest/{interest_id}/read")
async def mark_interest_as_read(interest_id: str, user: dict = Depends(get_current_user)):
    """Mark interest notification as read"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can mark as read")
    
    await db.home_service_interests.update_one(
        {"id": interest_id, "barber_id": user["id"]},
        {"$set": {"is_read": True}}
    )
    
    return {"success": True}

@api_router.put("/home-service-interest/{interest_id}/respond")
async def respond_to_interest(
    interest_id: str,
    action: str,  # "accept" or "reject"
    response_message: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    """Barber responds to home service interest"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can respond")
    
    if action not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Action must be 'accept' or 'reject'")
    
    interest = await db.home_service_interests.find_one(
        {"id": interest_id, "barber_id": user["id"]},
        {"_id": 0}
    )
    if not interest:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    status = "accepted" if action == "accept" else "rejected"
    
    await db.home_service_interests.update_one(
        {"id": interest_id},
        {
            "$set": {
                "status": status,
                "is_read": True,
                "barber_response": response_message
            }
        }
    )
    
    return {"success": True, "status": status}

@api_router.get("/home-service-interest/client")
async def get_client_interests(user: dict = Depends(get_current_user)):
    """Get client's registered interests and their status"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can view their interests")
    
    interests = await db.home_service_interests.find(
        {"client_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    
    # Add barber info
    for i in interests:
        barber = await db.users.find_one(
            {"id": i["barber_id"]},
            {"_id": 0, "name": 1, "phone": 1, "photo_url": 1}
        )
        i["barber"] = barber
    
    return interests

# ==================== REVIEW ROUTES ====================

@api_router.post("/reviews")
async def create_review(
    barber_id: str, 
    rating: int, 
    comment: Optional[str] = None, 
    queue_entry_id: Optional[str] = None,
    service_name: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can leave reviews")
    
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if already reviewed this entry
    if queue_entry_id:
        existing = await db.reviews.find_one({"queue_entry_id": queue_entry_id})
        if existing:
            raise HTTPException(status_code=400, detail="Already reviewed this service")
    
    review = Review(
        client_id=user["id"],
        client_name=user["name"],
        barber_id=barber_id,
        rating=rating,
        comment=comment,
        queue_entry_id=queue_entry_id,
        service_name=service_name
    )
    
    doc = review.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.reviews.insert_one(doc)
    
    # Update barber rating
    reviews = await db.reviews.find({"barber_id": barber_id}, {"rating": 1}).to_list(1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    await db.users.update_one(
        {"id": barber_id},
        {"$set": {"rating": round(avg_rating, 1), "total_reviews": len(reviews)}}
    )
    
    return {"success": True, "review": review.model_dump()}

@api_router.get("/reviews/{barber_id}")
async def get_reviews(barber_id: str):
    reviews = await db.reviews.find({"barber_id": barber_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    for r in reviews:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
    return reviews

# ==================== HISTORY ROUTES ====================

@api_router.get("/history")
async def get_history(user: dict = Depends(get_current_user)):
    if user["user_type"] == "client":
        entries = await db.queue.find(
            {"client_id": user["id"], "status": {"$in": ["completed", "cancelled"]}},
            {"_id": 0}
        ).sort("created_at", -1).to_list(50)
    else:
        entries = await db.queue.find(
            {"barber_id": user["id"], "status": {"$in": ["completed", "cancelled"]}},
            {"_id": 0}
        ).sort("created_at", -1).to_list(50)
    
    for e in entries:
        if isinstance(e.get("created_at"), str):
            e["created_at"] = datetime.fromisoformat(e["created_at"])
    
    return entries

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial barber data for testing - Dublin Metropolitan Region"""
    # Check if already seeded
    existing = await db.users.find_one({"email": "liam@barberx.com"})
    if existing:
        return {"message": "Already seeded"}
    
    barbers = [
        # Dublin City Center
        {
            "name": "Liam O'Connor",
            "email": "liam@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 123 4567",
            "user_type": "barber",
            "specialty": "Fade & Skin Fade",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
            "latitude": 53.3498,
            "longitude": -6.2603,
            "address": "Grafton Street 45, Dublin 2",
            "is_online": True,
            "rating": 4.8,
            "total_reviews": 127,
            "offers_home_service": True,
            "home_service_fee_per_km": 3.0,
            "instagram": "liam_barber_dublin",
            "referral_code": generate_referral_code(),
            "subscription_plan": "premium",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Classic Cut", "price": 25, "duration": 30},
                {"id": "2", "name": "Skin Fade", "price": 30, "duration": 40},
                {"id": "3", "name": "Beard Trim", "price": 15, "duration": 25},
                {"id": "4", "name": "Cut & Beard", "price": 38, "duration": 60}
            ]
        },
        # Camden Street - Dublin 2
        {
            "name": "Sean Murphy",
            "email": "sean@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 234 5678",
            "user_type": "barber",
            "specialty": "Beard & Traditional Cuts",
            "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
            "latitude": 53.3429,
            "longitude": -6.2674,
            "address": "Camden Street 78, Dublin 2",
            "is_online": True,
            "rating": 4.9,
            "total_reviews": 89,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.5,
            "instagram": "sean_traditional_cuts",
            "referral_code": generate_referral_code(),
            "subscription_plan": "basic",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Gentleman's Cut", "price": 22, "duration": 25},
                {"id": "2", "name": "Full Beard Shape", "price": 18, "duration": 30},
                {"id": "3", "name": "Premium Combo", "price": 35, "duration": 50}
            ]
        },
        # Swords - North Dublin
        {
            "name": "Conor Walsh",
            "email": "conor@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 345 6789",
            "user_type": "barber",
            "specialty": "Modern Styles & Colour",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            "latitude": 53.4597,
            "longitude": -6.2181,
            "address": "Main Street 32, Swords, Co. Dublin",
            "is_online": True,
            "rating": 4.7,
            "total_reviews": 64,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.0,
            "instagram": "conor_styles",
            "referral_code": generate_referral_code(),
            "subscription_plan": "basic",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Modern Cut", "price": 28, "duration": 35},
                {"id": "2", "name": "Hair Colour", "price": 45, "duration": 60},
                {"id": "3", "name": "Platinum Blonde", "price": 65, "duration": 90}
            ]
        },
        # Lucan - West Dublin
        {
            "name": "Patrick Byrne",
            "email": "patrick@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 456 7890",
            "user_type": "barber",
            "specialty": "Hot Towel & Razor Cuts",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            "latitude": 53.3538,
            "longitude": -6.4490,
            "address": "Main Street 15, Lucan, Co. Dublin",
            "is_online": True,
            "rating": 4.6,
            "total_reviews": 52,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.0,
            "instagram": "patrick_razor_lucan",
            "referral_code": generate_referral_code(),
            "subscription_plan": "premium",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Razor Cut", "price": 32, "duration": 45},
                {"id": "2", "name": "Razor Shave", "price": 20, "duration": 35},
                {"id": "3", "name": "Hot Towel Treatment", "price": 15, "duration": 20}
            ]
        },
        # Bray - South Dublin/Wicklow Coast
        {
            "name": "Declan Kelly",
            "email": "declan@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 567 8901",
            "user_type": "barber",
            "specialty": "Classic & Executive Cuts",
            "photo_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
            "latitude": 53.2028,
            "longitude": -6.0984,
            "address": "Main Street 88, Bray, Co. Wicklow",
            "is_online": True,
            "rating": 4.9,
            "total_reviews": 78,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.5,
            "instagram": "declan_bray_barber",
            "referral_code": generate_referral_code(),
            "subscription_plan": "premium",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Executive Cut", "price": 35, "duration": 40},
                {"id": "2", "name": "Classic Trim", "price": 25, "duration": 30},
                {"id": "3", "name": "Beard & Cut Combo", "price": 45, "duration": 55}
            ]
        },
        # Greystones - South Coast
        {
            "name": "Niall Doyle",
            "email": "niall@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 678 9012",
            "user_type": "barber",
            "specialty": "Surfer & Beach Styles",
            "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
            "latitude": 53.1459,
            "longitude": -6.0633,
            "address": "Church Road 22, Greystones, Co. Wicklow",
            "is_online": False,
            "rating": 4.5,
            "total_reviews": 45,
            "offers_home_service": True,
            "home_service_fee_per_km": 3.0,
            "instagram": "niall_greystones",
            "referral_code": generate_referral_code(),
            "subscription_plan": "basic",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Beach Wave Cut", "price": 28, "duration": 35},
                {"id": "2", "name": "Textured Style", "price": 30, "duration": 40},
                {"id": "3", "name": "Summer Trim", "price": 22, "duration": 25}
            ]
        },
        # Rathcoole - Southwest
        {
            "name": "Eoin McCarthy",
            "email": "eoin@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 789 0123",
            "user_type": "barber",
            "specialty": "Precision & Detail Work",
            "photo_url": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300",
            "latitude": 53.2823,
            "longitude": -6.4663,
            "address": "Main Street 5, Rathcoole, Co. Dublin",
            "is_online": True,
            "rating": 4.7,
            "total_reviews": 38,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.0,
            "instagram": "eoin_precision_cuts",
            "referral_code": generate_referral_code(),
            "subscription_plan": "basic",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Precision Cut", "price": 30, "duration": 40},
                {"id": "2", "name": "Detail Fade", "price": 35, "duration": 45},
                {"id": "3", "name": "Line Up", "price": 15, "duration": 20}
            ]
        },
        # Dun Laoghaire - East Coast
        {
            "name": "Cian O'Brien",
            "email": "cian@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 890 1234",
            "user_type": "barber",
            "specialty": "Premium Grooming",
            "photo_url": "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300",
            "latitude": 53.2945,
            "longitude": -6.1340,
            "address": "George's Street 45, Dun Laoghaire, Co. Dublin",
            "is_online": True,
            "rating": 4.8,
            "total_reviews": 92,
            "offers_home_service": True,
            "home_service_fee_per_km": 3.0,
            "instagram": "cian_grooming",
            "referral_code": generate_referral_code(),
            "subscription_plan": "premium",
            "subscription_status": "active",
            "services": [
                {"id": "1", "name": "Premium Cut", "price": 40, "duration": 45},
                {"id": "2", "name": "Luxury Shave", "price": 30, "duration": 35},
                {"id": "3", "name": "VIP Package", "price": 65, "duration": 75}
            ]
        }
    ]
    
    for barber in barbers:
        barber["id"] = str(uuid.uuid4())
        barber["created_at"] = datetime.now(timezone.utc).isoformat()
        barber["subscription_end"] = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        await db.users.insert_one(barber)
    
    return {"message": "Seeded 8 barbers across Dublin Metropolitan Region successfully"}

# ==================== REFERRAL ROUTES ====================

@api_router.get("/referral/info")
async def get_referral_info(user: dict = Depends(get_current_user)):
    """Get user's referral code and stats"""
    referrals = await db.referrals.find({"referrer_id": user["id"]}, {"_id": 0}).to_list(100)
    
    return {
        "referral_code": user.get("referral_code"),
        "referral_balance": user.get("referral_balance", 0),
        "bonus_per_referral": REFERRAL_BONUS,
        "total_referrals": len(referrals),
        "referrals": referrals
    }

@api_router.get("/referral/validate/{code}")
async def validate_referral_code(code: str):
    """Check if a referral code is valid"""
    user = await db.users.find_one({"referral_code": code}, {"_id": 0, "name": 1})
    if not user:
        raise HTTPException(status_code=404, detail="Invalid referral code")
    return {"valid": True, "referrer_name": user["name"]}

# ==================== SUBSCRIPTION ROUTES ====================

@api_router.get("/subscription/plans")
async def get_subscription_plans():
    """Get available subscription plans"""
    return {"plans": list(SUBSCRIPTION_PLANS.values())}

@api_router.get("/subscription/status")
async def get_subscription_status(user: dict = Depends(get_current_user)):
    """Get barber's subscription status"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers have subscriptions")
    
    return {
        "plan": user.get("subscription_plan"),
        "status": user.get("subscription_status"),
        "end_date": user.get("subscription_end"),
        "is_active": user.get("subscription_status") in ["active", "trial"]
    }

@api_router.post("/subscription/checkout")
async def create_subscription_checkout(plan_id: str, user: dict = Depends(get_current_user)):
    """Create Stripe checkout for subscription"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can subscribe")
    
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[plan_id]
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY)
    
    request = CheckoutSessionRequest(
        amount=plan["price"],
        currency=plan["currency"],
        quantity=1,
        success_url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/barber?subscription=success",
        cancel_url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/barber?subscription=cancelled",
        metadata={
            "user_id": user["id"],
            "plan_id": plan_id,
            "type": "subscription",
            "plan_name": plan["name"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(request)
    
    # Save payment transaction
    payment = PaymentTransaction(
        user_id=user["id"],
        user_email=user["email"],
        amount=plan["price"],
        currency=plan["currency"],
        payment_type="subscription",
        session_id=session.session_id,
        metadata={"plan_id": plan_id}
    )
    doc = payment.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.payments.insert_one(doc)
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/subscription/verify/{session_id}")
async def verify_subscription_payment(session_id: str, user: dict = Depends(get_current_user)):
    """Verify subscription payment status"""
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY)
    status = await stripe_checkout.get_checkout_status(session_id)
    
    if status.status == "complete":
        # Update subscription
        payment = await db.payments.find_one({"session_id": session_id})
        if payment:
            plan_id = payment.get("metadata", {}).get("plan_id", "basic")
            await db.users.update_one(
                {"id": user["id"]},
                {
                    "$set": {
                        "subscription_plan": plan_id,
                        "subscription_status": "active",
                        "subscription_end": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
                    }
                }
            )
            await db.payments.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid"}}
            )
    
    return {"status": status.status, "paid": status.status == "complete"}

# ==================== SERVICE PAYMENT ROUTES ====================

@api_router.post("/payment/checkout")
async def create_service_payment(
    barber_id: str,
    service: dict,
    is_home_service: bool = False,
    travel_fee: float = 0,
    user: dict = Depends(get_current_user)
):
    """Create payment checkout for a service"""
    total = service.get("price", 0) + travel_fee
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY)
    
    items = [{
        "name": service.get("name", "Serviço"),
        "description": f"ClickBarber - {service.get('name', 'Serviço')}",
        "amount": int(service.get("price", 0) * 100),
        "currency": "eur",
        "quantity": 1
    }]
    
    if travel_fee > 0:
        items.append({
            "name": "Taxa de deslocamento",
            "description": "Home service fee",
            "amount": int(travel_fee * 100),
            "currency": "eur",
            "quantity": 1
        })
    
    request = CheckoutSessionRequest(
        customer_email=user["email"],
        line_items=items,
        success_url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/client?payment=success",
        cancel_url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/client?payment=cancelled",
        metadata={
            "user_id": user["id"],
            "barber_id": barber_id,
            "service_id": service.get("id"),
            "type": "service"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(request)
    
    # Save payment transaction
    payment = PaymentTransaction(
        user_id=user["id"],
        user_email=user["email"],
        amount=total,
        currency="eur",
        payment_type="service",
        session_id=session.session_id,
        metadata={
            "barber_id": barber_id,
            "service": service,
            "is_home_service": is_home_service,
            "travel_fee": travel_fee
        }
    )
    doc = payment.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.payments.insert_one(doc)
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payment/verify/{session_id}")
async def verify_service_payment(session_id: str):
    """Verify service payment status"""
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY)
    status = await stripe_checkout.get_checkout_status(session_id)
    
    if status.status == "complete":
        await db.payments.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid"}}
        )
    
    return {"status": status.status, "paid": status.status == "complete"}

# ==================== CLIENT HISTORY FOR BARBERS ====================

@api_router.get("/barber/clients")
async def get_barber_clients(user: dict = Depends(get_current_user)):
    """Get list of clients who visited this barber"""
    if user["user_type"] != "barber":
        raise HTTPException(status_code=403, detail="Only barbers can view clients")
    
    # Get all completed services
    services = await db.queue.find(
        {"barber_id": user["id"], "status": "completed"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(500)
    
    # Group by client
    client_map = {}
    for s in services:
        client_id = s["client_id"]
        if client_id not in client_map:
            client_map[client_id] = {
                "client_id": client_id,
                "client_name": s["client_name"],
                "total_visits": 0,
                "total_spent": 0,
                "last_visit": None,
                "services": []
            }
        client_map[client_id]["total_visits"] += 1
        client_map[client_id]["total_spent"] += s.get("total_price", s.get("service", {}).get("price", 0))
        if not client_map[client_id]["last_visit"]:
            client_map[client_id]["last_visit"] = s.get("created_at")
        client_map[client_id]["services"].append({
            "name": s.get("service", {}).get("name"),
            "price": s.get("total_price", s.get("service", {}).get("price", 0)),
            "date": s.get("created_at")
        })
    
    clients = sorted(client_map.values(), key=lambda x: x["total_visits"], reverse=True)
    
    return {
        "total_clients": len(clients),
        "clients": clients
    }

# ==================== SHARE/SOCIAL ROUTES ====================

@api_router.get("/share/service/{service_id}")
async def get_share_content(service_id: str, user: dict = Depends(get_current_user)):
    """Generate share content for social media"""
    entry = await db.queue.find_one({"id": service_id, "client_id": user["id"]}, {"_id": 0})
    if not entry:
        raise HTTPException(status_code=404, detail="Service not found")
    
    barber = await db.users.find_one({"id": entry["barber_id"]}, {"_id": 0, "name": 1, "address": 1})
    
    text = f"✂️ Acabei de cortar no ClickBarber com {barber['name']}! Recomendo demais! 💈"
    referral_code = user.get('referral_code', '')
    text_with_referral = f"{text}\n\nUse meu código {referral_code} e ganhe €{REFERRAL_BONUS}!"
    
    # Encode for URLs
    encoded_text = text_with_referral.replace(' ', '%20').replace('\n', '%0A')
    
    return {
        "text": text,
        "text_with_referral": text_with_referral,
        "share_links": {
            "whatsapp": f"https://wa.me/?text={encoded_text}",
            "twitter": f"https://twitter.com/intent/tweet?text={encoded_text}",
            "facebook": f"https://www.facebook.com/sharer/sharer.php?quote={encoded_text}",
            "instagram": text_with_referral  # For copy-paste
        },
        "referral_code": referral_code
    }

@api_router.get("/")
async def root():
    return {"message": "ClickBarber API v1.0"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
