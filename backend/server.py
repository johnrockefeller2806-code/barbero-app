from fastapi import FastAPI, APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'quickcut-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

# Create the main app
app = FastAPI(title="QuickCut API - Barber Booking Platform")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

UserRole = Literal["client", "barber", "admin"]

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = "client"
    phone: str = ""

class BarberRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    shop_name: str
    address: str
    specialties: List[str] = []
    price_range_min: float = 20
    price_range_max: float = 50

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    role: str = "client"
    created_at: str
    avatar: Optional[str] = None
    # Barber specific fields
    shop_name: Optional[str] = None
    address: Optional[str] = None
    specialties: Optional[List[str]] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    is_available: Optional[bool] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class BarberPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    shop_name: str
    address: str
    avatar: Optional[str] = None
    rating: float = 4.5
    reviews_count: int = 0
    specialties: List[str] = []
    price_range_min: float = 20
    price_range_max: float = 50
    is_available: bool = False
    lat: Optional[float] = None
    lng: Optional[float] = None
    distance: Optional[str] = None

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    barber_id: str
    name: str
    description: str = ""
    duration_minutes: int = 30
    price: float
    active: bool = True

class ServiceCreate(BaseModel):
    name: str
    description: str = ""
    duration_minutes: int = 30
    price: float

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    barber_id: str
    barber_name: str
    shop_name: str
    service_id: str
    service_name: str
    service_price: float
    date: str
    time: str
    status: str = "pending"  # pending, confirmed, completed, cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BookingCreate(BaseModel):
    barber_id: str
    service_id: str
    date: str
    time: str

class AvailabilityUpdate(BaseModel):
    available: bool

class LocationUpdate(BaseModel):
    lat: float
    lng: float

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    client_id: str
    client_name: str
    barber_id: str
    rating: int  # 1-5
    comment: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReviewCreate(BaseModel):
    booking_id: str
    rating: int
    comment: str = ""

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str = "client") -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_barber_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if user.get("role") != "barber":
        raise HTTPException(status_code=403, detail="Barber access required")
    return user

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        return user
    except:
        return None

# ============== AUTH ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "QuickCut API", "version": "1.0.0", "location": "Dublin, Ireland 🇮🇪"}

@api_router.post("/auth/register", response_model=TokenResponse)
async def register_client(user_data: UserCreate):
    """Register a new client"""
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "password": hash_password(user_data.password),
        "role": "client",
        "avatar": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id, user_data.email, "client")
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=user_data.name,
            email=user_data.email,
            role="client",
            created_at=user["created_at"]
        )
    )

@api_router.post("/auth/register-barber", response_model=TokenResponse)
async def register_barber(data: BarberRegister):
    """Register a new barber"""
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password": hash_password(data.password),
        "role": "barber",
        "shop_name": data.shop_name,
        "address": data.address,
        "specialties": data.specialties,
        "price_range_min": data.price_range_min,
        "price_range_max": data.price_range_max,
        "rating": 5.0,
        "reviews_count": 0,
        "is_available": False,
        "lat": 53.3498,  # Dublin default
        "lng": -6.2603,
        "avatar": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    
    # Create default services
    default_services = [
        {"name": "Haircut", "description": "Classic haircut", "duration_minutes": 30, "price": 25},
        {"name": "Beard Trim", "description": "Beard shaping and trim", "duration_minutes": 20, "price": 15},
        {"name": "Fade", "description": "Skin fade or low fade", "duration_minutes": 40, "price": 30},
        {"name": "Haircut + Beard", "description": "Full service", "duration_minutes": 45, "price": 35},
    ]
    for svc in default_services:
        service = Service(barber_id=user_id, **svc)
        await db.services.insert_one(service.model_dump())
    
    token = create_token(user_id, data.email, "barber")
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=data.name,
            email=data.email,
            role="barber",
            shop_name=data.shop_name,
            address=data.address,
            specialties=data.specialties,
            rating=5.0,
            reviews_count=0,
            is_available=False,
            created_at=user["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    role = user.get("role", "client")
    token = create_token(user["id"], user["email"], role)
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=role,
            shop_name=user.get("shop_name"),
            address=user.get("address"),
            specialties=user.get("specialties"),
            rating=user.get("rating"),
            reviews_count=user.get("reviews_count"),
            is_available=user.get("is_available"),
            created_at=user["created_at"],
            avatar=user.get("avatar")
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(**user)

# ============== BARBER ROUTES ==============

@api_router.get("/barbers/available", response_model=List[BarberPublic])
async def get_available_barbers(lat: float = 53.3498, lng: float = -6.2603, radius: float = 10):
    """Get available barbers near location"""
    barbers = await db.users.find(
        {"role": "barber", "is_available": True},
        {"_id": 0, "password": 0}
    ).to_list(100)
    
    result = []
    for b in barbers:
        # Simple distance calculation (not accurate but good for demo)
        if b.get("lat") and b.get("lng"):
            dist = ((lat - b["lat"])**2 + (lng - b["lng"])**2)**0.5 * 111  # rough km
            if dist <= radius:
                result.append(BarberPublic(
                    id=b["id"],
                    name=b["name"],
                    shop_name=b.get("shop_name", ""),
                    address=b.get("address", ""),
                    avatar=b.get("avatar"),
                    rating=b.get("rating", 4.5),
                    reviews_count=b.get("reviews_count", 0),
                    specialties=b.get("specialties", []),
                    price_range_min=b.get("price_range_min", 20),
                    price_range_max=b.get("price_range_max", 50),
                    is_available=True,
                    lat=b.get("lat"),
                    lng=b.get("lng"),
                    distance=f"{dist:.1f} km"
                ))
    
    # Sort by distance
    result.sort(key=lambda x: float(x.distance.replace(" km", "")) if x.distance else 999)
    return result

@api_router.get("/barbers", response_model=List[BarberPublic])
async def get_all_barbers():
    """Get all barbers"""
    barbers = await db.users.find(
        {"role": "barber"},
        {"_id": 0, "password": 0}
    ).to_list(100)
    
    return [BarberPublic(
        id=b["id"],
        name=b["name"],
        shop_name=b.get("shop_name", ""),
        address=b.get("address", ""),
        avatar=b.get("avatar"),
        rating=b.get("rating", 4.5),
        reviews_count=b.get("reviews_count", 0),
        specialties=b.get("specialties", []),
        price_range_min=b.get("price_range_min", 20),
        price_range_max=b.get("price_range_max", 50),
        is_available=b.get("is_available", False),
        lat=b.get("lat"),
        lng=b.get("lng")
    ) for b in barbers]

@api_router.get("/barbers/{barber_id}", response_model=BarberPublic)
async def get_barber(barber_id: str):
    barber = await db.users.find_one(
        {"id": barber_id, "role": "barber"},
        {"_id": 0, "password": 0}
    )
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    return BarberPublic(
        id=barber["id"],
        name=barber["name"],
        shop_name=barber.get("shop_name", ""),
        address=barber.get("address", ""),
        avatar=barber.get("avatar"),
        rating=barber.get("rating", 4.5),
        reviews_count=barber.get("reviews_count", 0),
        specialties=barber.get("specialties", []),
        price_range_min=barber.get("price_range_min", 20),
        price_range_max=barber.get("price_range_max", 50),
        is_available=barber.get("is_available", False),
        lat=barber.get("lat"),
        lng=barber.get("lng")
    )

@api_router.post("/barbers/availability")
async def set_availability(data: AvailabilityUpdate, user: dict = Depends(get_barber_user)):
    """Toggle barber availability"""
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"is_available": data.available}}
    )
    logger.info(f"Barber {user['name']} is now {'AVAILABLE' if data.available else 'OFFLINE'}")
    return {"status": "success", "is_available": data.available}

@api_router.post("/barbers/location")
async def update_location(data: LocationUpdate, user: dict = Depends(get_barber_user)):
    """Update barber location"""
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"lat": data.lat, "lng": data.lng}}
    )
    return {"status": "success", "lat": data.lat, "lng": data.lng}

# ============== SERVICES ROUTES ==============

@api_router.get("/barbers/{barber_id}/services", response_model=List[Service])
async def get_barber_services(barber_id: str):
    services = await db.services.find(
        {"barber_id": barber_id, "active": True},
        {"_id": 0}
    ).to_list(50)
    return services

@api_router.post("/services", response_model=Service)
async def create_service(data: ServiceCreate, user: dict = Depends(get_barber_user)):
    service = Service(barber_id=user["id"], **data.model_dump())
    await db.services.insert_one(service.model_dump())
    return service

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(get_barber_user)):
    result = await db.services.update_one(
        {"id": service_id, "barber_id": user["id"]},
        {"$set": {"active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"status": "success"}

# ============== BOOKING ROUTES ==============

@api_router.post("/bookings", response_model=Booking)
async def create_booking(data: BookingCreate, user: dict = Depends(get_current_user)):
    """Create a new booking"""
    barber = await db.users.find_one({"id": data.barber_id, "role": "barber"}, {"_id": 0, "password": 0})
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    service = await db.services.find_one({"id": data.service_id, "barber_id": data.barber_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    booking = Booking(
        client_id=user["id"],
        client_name=user["name"],
        barber_id=barber["id"],
        barber_name=barber["name"],
        shop_name=barber.get("shop_name", ""),
        service_id=service["id"],
        service_name=service["name"],
        service_price=service["price"],
        date=data.date,
        time=data.time
    )
    await db.bookings.insert_one(booking.model_dump())
    
    logger.info(f"New booking: {user['name']} booked {service['name']} with {barber['name']} at {data.time}")
    return booking

@api_router.get("/bookings/my", response_model=List[Booking])
async def get_my_bookings(user: dict = Depends(get_current_user)):
    """Get client's bookings"""
    bookings = await db.bookings.find(
        {"client_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return bookings

@api_router.get("/bookings/barber", response_model=List[Booking])
async def get_barber_bookings(user: dict = Depends(get_barber_user)):
    """Get barber's bookings"""
    bookings = await db.bookings.find(
        {"barber_id": user["id"]},
        {"_id": 0}
    ).sort("date", 1).to_list(100)
    return bookings

@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str, user: dict = Depends(get_current_user)):
    """Update booking status"""
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    # Check if user owns the booking (client or barber)
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["client_id"] != user["id"] and booking["barber_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status}}
    )
    return {"status": "success", "booking_status": status}

@api_router.delete("/bookings/{booking_id}")
async def cancel_booking(booking_id: str, user: dict = Depends(get_current_user)):
    """Cancel a booking"""
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["client_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": "cancelled"}}
    )
    return {"status": "success", "message": "Booking cancelled"}

# ============== REVIEWS ROUTES ==============

@api_router.post("/reviews", response_model=Review)
async def create_review(data: ReviewCreate, user: dict = Depends(get_current_user)):
    """Create a review for a completed booking"""
    booking = await db.bookings.find_one(
        {"id": data.booking_id, "client_id": user["id"], "status": "completed"},
        {"_id": 0}
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or not completed")
    
    # Check if already reviewed
    existing = await db.reviews.find_one({"booking_id": data.booking_id})
    if existing:
        raise HTTPException(status_code=400, detail="Booking already reviewed")
    
    review = Review(
        booking_id=data.booking_id,
        client_id=user["id"],
        client_name=user["name"],
        barber_id=booking["barber_id"],
        rating=min(5, max(1, data.rating)),
        comment=data.comment
    )
    await db.reviews.insert_one(review.model_dump())
    
    # Update barber rating
    all_reviews = await db.reviews.find({"barber_id": booking["barber_id"]}, {"_id": 0}).to_list(1000)
    avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
    await db.users.update_one(
        {"id": booking["barber_id"]},
        {"$set": {"rating": round(avg_rating, 1), "reviews_count": len(all_reviews)}}
    )
    
    return review

@api_router.get("/barbers/{barber_id}/reviews", response_model=List[Review])
async def get_barber_reviews(barber_id: str):
    reviews = await db.reviews.find(
        {"barber_id": barber_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return reviews

# ============== BARBER DASHBOARD ROUTES ==============

@api_router.get("/barber/dashboard")
async def get_barber_dashboard(user: dict = Depends(get_barber_user)):
    """Get barber dashboard stats"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Today's bookings
    today_bookings = await db.bookings.find(
        {"barber_id": user["id"], "date": today},
        {"_id": 0}
    ).to_list(100)
    
    # Calculate today's earnings
    completed_today = [b for b in today_bookings if b["status"] == "completed"]
    today_earnings = sum(b["service_price"] for b in completed_today)
    
    # Pending bookings
    pending = [b for b in today_bookings if b["status"] == "pending"]
    
    # Total stats
    all_completed = await db.bookings.count_documents(
        {"barber_id": user["id"], "status": "completed"}
    )
    
    return {
        "today": {
            "earnings": today_earnings,
            "clients": len(completed_today),
            "pending": len(pending),
            "bookings": today_bookings
        },
        "total": {
            "completed_bookings": all_completed
        },
        "is_available": user.get("is_available", False),
        "rating": user.get("rating", 5.0),
        "reviews_count": user.get("reviews_count", 0)
    }

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_data():
    """Seed database with sample data"""
    # Check if already seeded
    existing = await db.users.find_one({"email": "james@fadedublin.ie"})
    if existing:
        return {"message": "Database already seeded"}
    
    # Sample barbers
    barbers_data = [
        {
            "name": "James Murphy",
            "email": "james@fadedublin.ie",
            "phone": "+353851234567",
            "shop_name": "Fade Factory Dublin",
            "address": "123 Grafton Street, Dublin 2",
            "specialties": ["Fade", "Beard", "Skin Fade"],
            "price_range_min": 20,
            "price_range_max": 45,
            "rating": 4.9,
            "reviews_count": 324,
            "is_available": True,
            "lat": 53.3412,
            "lng": -6.2592,
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
        },
        {
            "name": "Sean O'Connor",
            "email": "sean@craftedcut.ie",
            "phone": "+353852345678",
            "shop_name": "The Crafted Cut",
            "address": "45 Camden Street, Dublin 2",
            "specialties": ["Classic", "Styling", "Hot Towel"],
            "price_range_min": 25,
            "price_range_max": 55,
            "rating": 4.8,
            "reviews_count": 256,
            "is_available": True,
            "lat": 53.3341,
            "lng": -6.2654,
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
        },
        {
            "name": "Patrick Kelly",
            "email": "patrick@precision.ie",
            "phone": "+353853456789",
            "shop_name": "Precision Barbers",
            "address": "78 Capel Street, Dublin 1",
            "specialties": ["Skin Fade", "Design", "Razor"],
            "price_range_min": 30,
            "price_range_max": 60,
            "rating": 4.7,
            "reviews_count": 189,
            "is_available": False,
            "lat": 53.3478,
            "lng": -6.2672,
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
        },
        {
            "name": "Liam Brennan",
            "email": "liam@sharpedge.ie",
            "phone": "+353854567890",
            "shop_name": "Sharp Edge Studio",
            "address": "12 Dawson Street, Dublin 2",
            "specialties": ["Fade", "Lines", "Color"],
            "price_range_min": 25,
            "price_range_max": 50,
            "rating": 4.6,
            "reviews_count": 142,
            "is_available": True,
            "lat": 53.3405,
            "lng": -6.2578,
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
        },
    ]
    
    for barber_data in barbers_data:
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "password": hash_password("barber123"),
            "role": "barber",
            "created_at": datetime.now(timezone.utc).isoformat(),
            **barber_data
        }
        await db.users.insert_one(user)
        
        # Create services for each barber
        services = [
            {"name": "Haircut", "description": "Classic haircut", "duration_minutes": 30, "price": barber_data["price_range_min"]},
            {"name": "Fade", "description": "Skin fade or low fade", "duration_minutes": 40, "price": barber_data["price_range_min"] + 10},
            {"name": "Beard Trim", "description": "Beard shaping and trim", "duration_minutes": 20, "price": 15},
            {"name": "Haircut + Beard", "description": "Full service combo", "duration_minutes": 50, "price": barber_data["price_range_max"]},
        ]
        for svc in services:
            service = Service(barber_id=user_id, **svc)
            await db.services.insert_one(service.model_dump())
    
    # Create demo client
    client_id = str(uuid.uuid4())
    client = {
        "id": client_id,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+353856789012",
        "password": hash_password("client123"),
        "role": "client",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(client)
    
    logger.info("Database seeded with sample data!")
    return {"message": "Database seeded successfully!", "barbers": len(barbers_data), "client": "john@example.com / client123"}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
