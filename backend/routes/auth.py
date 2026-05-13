from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
from database import get_db
from middleware.auth_middleware import hash_password, verify_password, create_access_token, get_current_user
from fastapi import Depends

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/login")
async def login(data: LoginRequest):
    print(f"DEBUG: Login attempt for email: {data.email}")
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user:
        print(f"DEBUG: User not found for email: {data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user["password"]):
        print(f"DEBUG: Password verification failed for user: {data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"DEBUG: Login successful for user: {data.email}")
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "user"),
            "createdAt": user.get("created_at", ""),
        },
    }

@router.post("/signup")
async def signup(data: SignupRequest):
    db = get_db()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "role": "user",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    result = await db.users.insert_one(user_doc)
    token = create_access_token({"sub": str(result.inserted_id), "email": data.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": data.name,
            "email": data.email,
            "role": "user",
            "createdAt": user_doc["created_at"],
        },
    }

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent."}
    # In production: send email with reset token
    return {"message": "If the email exists, a reset link has been sent."}

@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return user

@router.put("/profile")
async def update_profile(updates: dict, user=Depends(get_current_user)):
    db = get_db()
    from bson import ObjectId
    allowed = {"name", "avatar"}
    filtered = {k: v for k, v in updates.items() if k in allowed}
    filtered["updated_at"] = datetime.utcnow().isoformat()
    await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": filtered})
    return {"message": "Profile updated"}
