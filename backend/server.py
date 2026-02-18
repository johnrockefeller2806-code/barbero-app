from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import jwt
import math
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

JWT_SECRET = os.environ.get('JWT_SECRET', 'barberx-secret-key-2024')

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_API_KEY', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

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
    # Home service fields
    offers_home_service: bool = False
    home_service_fee_per_km: float = 2.0  # € per km

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    user_type: str
    photo_url: Optional[str] = None
    # Barber fields
    specialty: Optional[str] = None
    services: Optional[List[dict]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    is_online: bool = False
    rating: float = 5.0
    total_reviews: int = 0
    # Home service fields
    offers_home_service: bool = False
    home_service_fee_per_km: float = 2.0
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
    # Home service fields
    is_home_service: bool = False
    client_address: Optional[str] = None
    client_latitude: Optional[float] = None
    client_longitude: Optional[float] = None
    distance_km: float = 0
    travel_fee: float = 0
    total_price: float = 0
    # Payment
    payment_method: str = "cash"  # cash or card
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    barber_id: str
    rating: int
    comment: Optional[str] = None
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

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(input: UserRegister):
    existing = await db.users.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = input.model_dump()
    user_data["password"] = hash_password(input.password)
    user = User(**user_data)
    doc = user.model_dump()
    doc["password"] = user_data["password"]
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.users.insert_one(doc)
    token = create_token(user.id, user.user_type)
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type": user.user_type,
            "photo_url": user.photo_url
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

@api_router.put("/barbers/profile")
async def update_barber_profile(
    specialty: Optional[str] = None,
    services: Optional[List[dict]] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    address: Optional[str] = None,
    photo_url: Optional[str] = None,
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
    
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
    
    return {"success": True}

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
    user: dict = Depends(get_current_user)
):
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can join queue")
    
    # Check if already in queue
    existing = await db.queue.find_one({
        "client_id": user["id"],
        "barber_id": barber_id,
        "status": "waiting"
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
    
    # Get position
    last_in_queue = await db.queue.find_one(
        {"barber_id": barber_id, "status": "waiting"},
        sort=[("position", -1)]
    )
    position = (last_in_queue["position"] + 1) if last_in_queue else 1
    
    entry = QueueEntry(
        client_id=user["id"],
        client_name=user["name"],
        barber_id=barber_id,
        service=service,
        position=position,
        estimated_wait=position * service.get("duration", 30),
        is_home_service=is_home_service,
        client_address=client_address,
        client_latitude=client_latitude,
        client_longitude=client_longitude,
        distance_km=round(distance_km, 1),
        travel_fee=travel_fee,
        total_price=total_price,
        payment_method=payment_method
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
        # Get barber info
        barber = await db.users.find_one({"id": e["barber_id"]}, {"_id": 0, "name": 1, "photo_url": 1, "address": 1})
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

# ==================== REVIEW ROUTES ====================

@api_router.post("/reviews")
async def create_review(barber_id: str, rating: int, comment: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Only clients can leave reviews")
    
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    review = Review(
        client_id=user["id"],
        client_name=user["name"],
        barber_id=barber_id,
        rating=rating,
        comment=comment
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
    """Seed initial barber data for testing"""
    # Check if already seeded
    existing = await db.users.find_one({"email": "carlos@barberx.com"})
    if existing:
        return {"message": "Already seeded"}
    
    barbers = [
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
            "services": [
                {"id": "1", "name": "Classic Cut", "price": 25, "duration": 30},
                {"id": "2", "name": "Skin Fade", "price": 30, "duration": 40},
                {"id": "3", "name": "Beard Trim", "price": 15, "duration": 25},
                {"id": "4", "name": "Cut & Beard", "price": 38, "duration": 60}
            ]
        },
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
            "services": [
                {"id": "1", "name": "Gentleman's Cut", "price": 22, "duration": 25},
                {"id": "2", "name": "Full Beard Shape", "price": 18, "duration": 30},
                {"id": "3", "name": "Premium Combo", "price": 35, "duration": 50}
            ]
        },
        {
            "name": "Conor Walsh",
            "email": "conor@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 345 6789",
            "user_type": "barber",
            "specialty": "Modern Styles & Colour",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            "latitude": 53.3558,
            "longitude": -6.2489,
            "address": "O'Connell Street 120, Dublin 1",
            "is_online": False,
            "rating": 4.7,
            "total_reviews": 64,
            "offers_home_service": False,
            "home_service_fee_per_km": 0,
            "services": [
                {"id": "1", "name": "Modern Cut", "price": 28, "duration": 35},
                {"id": "2", "name": "Hair Colour", "price": 45, "duration": 60},
                {"id": "3", "name": "Platinum Blonde", "price": 65, "duration": 90}
            ]
        },
        {
            "name": "Patrick Byrne",
            "email": "patrick@barberx.com",
            "password": hash_password("123456"),
            "phone": "+353 87 456 7890",
            "user_type": "barber",
            "specialty": "Hot Towel & Razor Cuts",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
            "latitude": 53.3381,
            "longitude": -6.2592,
            "address": "Harcourt Street 55, Dublin 2",
            "is_online": True,
            "rating": 4.6,
            "total_reviews": 52,
            "offers_home_service": True,
            "home_service_fee_per_km": 2.0,
            "services": [
                {"id": "1", "name": "Razor Cut", "price": 32, "duration": 45},
                {"id": "2", "name": "Razor Shave", "price": 20, "duration": 35},
                {"id": "3", "name": "Hot Towel Treatment", "price": 15, "duration": 20}
            ]
        }
    ]
    
    for barber in barbers:
        barber["id"] = str(uuid.uuid4())
        barber["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.users.insert_one(barber)
    
    return {"message": "Seeded 4 barbers successfully"}

@api_router.get("/")
async def root():
    return {"message": "BarberX API v1.0"}

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
