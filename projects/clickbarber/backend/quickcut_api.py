# ============================================================
# QuickCut - Backend API for Barber Booking App
# ============================================================

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os
import bcrypt
import jwt

# Get database from main app
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'quickcut')]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'quickcut-secret-key')
JWT_ALGORITHM = "HS256"

# Create router
quickcut_router = APIRouter(prefix="/quickcut", tags=["QuickCut"])

# ============== MODELS ==============

class UserRole:
    CLIENT = "client"
    BARBER = "barber"

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    price: float
    duration_minutes: int = 30

class BarberRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    shop_name: str
    bio: Optional[str] = None

class ClientRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AvailabilityUpdate(BaseModel):
    available: bool

class LocationUpdate(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class BookingCreate(BaseModel):
    barber_id: str
    service_id: str
    date: str  # ISO format
    time: str  # HH:MM

class BookingStatusUpdate(BaseModel):
    status: str  # pending, confirmed, completed, cancelled

# ============== HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.quickcut_users.find_one({"id": payload["user_id"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== AUTH ROUTES ==============

@quickcut_router.post("/auth/register/barber")
async def register_barber(data: BarberRegister):
    """Register a new barber"""
    # Check if email exists
    existing = await db.quickcut_users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    barber = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password": hash_password(data.password),
        "role": UserRole.BARBER,
        "shop_name": data.shop_name,
        "bio": data.bio,
        "rating": 5.0,
        "reviews_count": 0,
        "total_cuts": 0,
        "is_available": False,
        "location": None,
        "services": [
            {"id": str(uuid.uuid4()), "name": "Haircut", "price": 25, "duration_minutes": 30},
            {"id": str(uuid.uuid4()), "name": "Beard Trim", "price": 15, "duration_minutes": 15},
            {"id": str(uuid.uuid4()), "name": "Haircut + Beard", "price": 35, "duration_minutes": 45},
        ],
        "working_hours": {
            "monday": {"open": "09:00", "close": "18:00"},
            "tuesday": {"open": "09:00", "close": "18:00"},
            "wednesday": {"open": "09:00", "close": "18:00"},
            "thursday": {"open": "09:00", "close": "18:00"},
            "friday": {"open": "09:00", "close": "18:00"},
            "saturday": {"open": "10:00", "close": "16:00"},
            "sunday": None
        },
        "stripe_account_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.quickcut_users.insert_one(barber)
    
    token = create_token(barber["id"], barber["email"], barber["role"])
    
    return {
        "access_token": token,
        "user": {
            "id": barber["id"],
            "name": barber["name"],
            "email": barber["email"],
            "role": barber["role"],
            "shop_name": barber["shop_name"],
        }
    }

@quickcut_router.post("/auth/register/client")
async def register_client(data: ClientRegister):
    """Register a new client"""
    existing = await db.quickcut_users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    client_user = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password": hash_password(data.password),
        "role": UserRole.CLIENT,
        "favorite_barbers": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.quickcut_users.insert_one(client_user)
    
    token = create_token(client_user["id"], client_user["email"], client_user["role"])
    
    return {
        "access_token": token,
        "user": {
            "id": client_user["id"],
            "name": client_user["name"],
            "email": client_user["email"],
            "role": client_user["role"],
        }
    }

@quickcut_router.post("/auth/login")
async def login(data: LoginRequest):
    """Login for both clients and barbers"""
    user = await db.quickcut_users.find_one({"email": data.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["id"], user["email"], user["role"])
    
    response_user = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }
    
    if user["role"] == UserRole.BARBER:
        response_user["shop_name"] = user.get("shop_name")
        response_user["is_available"] = user.get("is_available", False)
        response_user["rating"] = user.get("rating", 5.0)
    
    return {
        "access_token": token,
        "user": response_user
    }

@quickcut_router.get("/auth/me")
async def get_me(token: str):
    """Get current user profile"""
    user = await get_current_user(token)
    
    response = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "role": user["role"],
    }
    
    if user["role"] == UserRole.BARBER:
        response.update({
            "shop_name": user.get("shop_name"),
            "bio": user.get("bio"),
            "rating": user.get("rating"),
            "reviews_count": user.get("reviews_count"),
            "is_available": user.get("is_available"),
            "location": user.get("location"),
            "services": user.get("services", []),
        })
    
    return response

# ============== BARBER ROUTES ==============

@quickcut_router.get("/barbers/available")
async def get_available_barbers(lat: float, lng: float, radius: float = 5.0):
    """Get all available barbers near a location"""
    # For simplicity, we'll just get all available barbers
    # In production, you'd use geospatial queries
    barbers = await db.quickcut_users.find({
        "role": UserRole.BARBER,
        "is_available": True
    }).to_list(100)
    
    result = []
    for barber in barbers:
        # Calculate distance (simplified - in production use proper geo calculation)
        barber_loc = barber.get("location")
        distance = 0.5  # Placeholder
        
        if barber_loc:
            # Simple distance calculation
            dlat = abs(barber_loc.get("lat", 0) - lat)
            dlng = abs(barber_loc.get("lng", 0) - lng)
            distance = round((dlat + dlng) * 111, 1)  # Rough km conversion
        
        if distance <= radius:
            result.append({
                "id": barber["id"],
                "name": barber["name"],
                "shop_name": barber.get("shop_name"),
                "rating": barber.get("rating", 5.0),
                "reviews_count": barber.get("reviews_count", 0),
                "is_available": barber.get("is_available", False),
                "distance": distance,
                "location": barber.get("location"),
                "services": barber.get("services", []),
                "avatar_url": barber.get("avatar_url"),
            })
    
    # Sort by distance
    result.sort(key=lambda x: x["distance"])
    
    return result

@quickcut_router.get("/barbers/{barber_id}")
async def get_barber(barber_id: str):
    """Get barber details"""
    barber = await db.quickcut_users.find_one({
        "id": barber_id,
        "role": UserRole.BARBER
    })
    
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    return {
        "id": barber["id"],
        "name": barber["name"],
        "shop_name": barber.get("shop_name"),
        "bio": barber.get("bio"),
        "rating": barber.get("rating", 5.0),
        "reviews_count": barber.get("reviews_count", 0),
        "total_cuts": barber.get("total_cuts", 0),
        "is_available": barber.get("is_available", False),
        "location": barber.get("location"),
        "services": barber.get("services", []),
        "working_hours": barber.get("working_hours"),
        "avatar_url": barber.get("avatar_url"),
    }

@quickcut_router.post("/barbers/availability")
async def update_availability(data: AvailabilityUpdate, token: str):
    """Toggle barber availability (Available Now button)"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can update availability")
    
    await db.quickcut_users.update_one(
        {"id": user["id"]},
        {"$set": {"is_available": data.available}}
    )
    
    return {
        "status": "success",
        "is_available": data.available,
        "message": "You are now available!" if data.available else "You are now offline"
    }

@quickcut_router.post("/barbers/location")
async def update_location(data: LocationUpdate, token: str):
    """Update barber's current location"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can update location")
    
    location = {
        "lat": data.lat,
        "lng": data.lng,
        "address": data.address,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.quickcut_users.update_one(
        {"id": user["id"]},
        {"$set": {"location": location}}
    )
    
    return {"status": "success", "location": location}

@quickcut_router.get("/barbers/{barber_id}/services")
async def get_barber_services(barber_id: str):
    """Get barber's services"""
    barber = await db.quickcut_users.find_one({
        "id": barber_id,
        "role": UserRole.BARBER
    })
    
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    return barber.get("services", [])

@quickcut_router.post("/barbers/services")
async def add_service(service: Service, token: str):
    """Add a new service (barber only)"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can add services")
    
    service_dict = service.dict()
    
    await db.quickcut_users.update_one(
        {"id": user["id"]},
        {"$push": {"services": service_dict}}
    )
    
    return {"status": "success", "service": service_dict}

# ============== BOOKING ROUTES ==============

@quickcut_router.post("/bookings")
async def create_booking(data: BookingCreate, token: str):
    """Create a new booking"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can create bookings")
    
    # Get barber
    barber = await db.quickcut_users.find_one({"id": data.barber_id})
    if not barber:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    # Get service
    service = next((s for s in barber.get("services", []) if s["id"] == data.service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    booking = {
        "id": str(uuid.uuid4()),
        "client_id": user["id"],
        "client_name": user["name"],
        "client_phone": user["phone"],
        "barber_id": data.barber_id,
        "barber_name": barber["name"],
        "shop_name": barber.get("shop_name"),
        "service_id": data.service_id,
        "service_name": service["name"],
        "price": service["price"],
        "duration_minutes": service.get("duration_minutes", 30),
        "date": data.date,
        "time": data.time,
        "status": "pending",  # pending, confirmed, completed, cancelled
        "payment_status": "unpaid",  # unpaid, paid
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.quickcut_bookings.insert_one(booking)
    
    return booking

@quickcut_router.get("/bookings/my")
async def get_my_bookings(token: str):
    """Get client's bookings"""
    user = await get_current_user(token)
    
    bookings = await db.quickcut_bookings.find({
        "client_id": user["id"]
    }).sort("created_at", -1).to_list(50)
    
    return bookings

@quickcut_router.get("/bookings/barber")
async def get_barber_bookings(token: str):
    """Get barber's bookings"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can view barber bookings")
    
    bookings = await db.quickcut_bookings.find({
        "barber_id": user["id"]
    }).sort("created_at", -1).to_list(50)
    
    return bookings

@quickcut_router.get("/bookings/barber/today")
async def get_today_bookings(token: str):
    """Get barber's bookings for today"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can view barber bookings")
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    bookings = await db.quickcut_bookings.find({
        "barber_id": user["id"],
        "date": today,
        "status": {"$in": ["pending", "confirmed"]}
    }).sort("time", 1).to_list(50)
    
    return bookings

@quickcut_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, data: BookingStatusUpdate, token: str):
    """Update booking status (barber confirms/completes, client cancels)"""
    user = await get_current_user(token)
    
    booking = await db.quickcut_bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check permissions
    if user["role"] == UserRole.CLIENT and booking["client_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your booking")
    if user["role"] == UserRole.BARBER and booking["barber_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your booking")
    
    # Validate status transition
    valid_transitions = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["completed", "cancelled"],
    }
    
    current_status = booking["status"]
    if data.status not in valid_transitions.get(current_status, []):
        raise HTTPException(status_code=400, detail=f"Cannot change from {current_status} to {data.status}")
    
    await db.quickcut_bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": data.status}}
    )
    
    # If completed, increment barber's total cuts
    if data.status == "completed":
        await db.quickcut_users.update_one(
            {"id": booking["barber_id"]},
            {"$inc": {"total_cuts": 1}}
        )
    
    return {"status": "success", "booking_status": data.status}

# ============== STATS ROUTES ==============

@quickcut_router.get("/barbers/stats/today")
async def get_today_stats(token: str):
    """Get barber's stats for today"""
    user = await get_current_user(token)
    
    if user["role"] != UserRole.BARBER:
        raise HTTPException(status_code=403, detail="Only barbers can view stats")
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Get today's completed bookings
    completed = await db.quickcut_bookings.find({
        "barber_id": user["id"],
        "date": today,
        "status": "completed"
    }).to_list(100)
    
    # Get pending bookings
    pending = await db.quickcut_bookings.count_documents({
        "barber_id": user["id"],
        "date": today,
        "status": {"$in": ["pending", "confirmed"]}
    })
    
    total_earnings = sum(b.get("price", 0) for b in completed)
    
    return {
        "date": today,
        "earnings": total_earnings,
        "clients": len(completed),
        "pending": pending,
        "rating": user.get("rating", 5.0),
    }

# ============== SEED DATA ==============

@quickcut_router.post("/seed")
async def seed_database():
    """Seed database with sample data for Dublin"""
    
    # Sample barbers in Dublin
    barbers = [
        {
            "id": str(uuid.uuid4()),
            "name": "James Murphy",
            "email": "james@fadedublin.ie",
            "phone": "+353851234567",
            "password": hash_password("barber123"),
            "role": UserRole.BARBER,
            "shop_name": "Fade Factory Dublin",
            "bio": "Master barber with 10+ years experience. Specializing in fades and beard grooming.",
            "rating": 4.9,
            "reviews_count": 324,
            "total_cuts": 1250,
            "is_available": True,
            "location": {"lat": 53.3498, "lng": -6.2603, "address": "45 Grafton St, Dublin 2"},
            "services": [
                {"id": str(uuid.uuid4()), "name": "Skin Fade", "price": 25, "duration_minutes": 30},
                {"id": str(uuid.uuid4()), "name": "Beard Trim", "price": 15, "duration_minutes": 15},
                {"id": str(uuid.uuid4()), "name": "Fade + Beard", "price": 35, "duration_minutes": 45},
                {"id": str(uuid.uuid4()), "name": "Premium Cut", "price": 40, "duration_minutes": 45},
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sean O'Connor",
            "email": "sean@craftedcut.ie",
            "phone": "+353852345678",
            "password": hash_password("barber123"),
            "role": UserRole.BARBER,
            "shop_name": "The Crafted Cut",
            "bio": "Traditional and modern styles. Winner of Dublin Barber Awards 2024.",
            "rating": 4.8,
            "reviews_count": 256,
            "total_cuts": 980,
            "is_available": True,
            "location": {"lat": 53.3459, "lng": -6.2675, "address": "12 Temple Bar, Dublin 2"},
            "services": [
                {"id": str(uuid.uuid4()), "name": "Classic Cut", "price": 30, "duration_minutes": 30},
                {"id": str(uuid.uuid4()), "name": "Hot Towel Shave", "price": 25, "duration_minutes": 30},
                {"id": str(uuid.uuid4()), "name": "Hair + Shave", "price": 50, "duration_minutes": 60},
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Patrick Kelly",
            "email": "patrick@precisionbarbers.ie",
            "phone": "+353853456789",
            "password": hash_password("barber123"),
            "role": UserRole.BARBER,
            "shop_name": "Precision Barbers",
            "bio": "Expert in hair designs and creative cuts. Your style, perfected.",
            "rating": 4.7,
            "reviews_count": 189,
            "total_cuts": 720,
            "is_available": False,
            "location": {"lat": 53.3505, "lng": -6.2605, "address": "78 O'Connell St, Dublin 1"},
            "services": [
                {"id": str(uuid.uuid4()), "name": "Designer Cut", "price": 35, "duration_minutes": 45},
                {"id": str(uuid.uuid4()), "name": "Hair Design", "price": 45, "duration_minutes": 60},
                {"id": str(uuid.uuid4()), "name": "Kids Cut", "price": 18, "duration_minutes": 20},
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    ]
    
    # Sample client
    client = {
        "id": str(uuid.uuid4()),
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+353854567890",
        "password": hash_password("client123"),
        "role": UserRole.CLIENT,
        "favorite_barbers": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    # Clear existing data
    await db.quickcut_users.delete_many({})
    await db.quickcut_bookings.delete_many({})
    
    # Insert data
    await db.quickcut_users.insert_many(barbers)
    await db.quickcut_users.insert_one(client)
    
    return {
        "status": "success",
        "message": "Database seeded successfully",
        "data": {
            "barbers": len(barbers),
            "clients": 1,
        },
        "test_accounts": {
            "barber": {"email": "james@fadedublin.ie", "password": "barber123"},
            "client": {"email": "john@example.com", "password": "client123"}
        }
    }
