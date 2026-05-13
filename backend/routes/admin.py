from fastapi import APIRouter, Depends, Query, HTTPException
from database import get_db
from middleware.auth_middleware import get_admin_user
from bson import ObjectId

router = APIRouter()

@router.get("/users")
async def get_users(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100), admin=Depends(get_admin_user)):
    db = get_db()
    total = await db.users.count_documents({})
    cursor = db.users.find({}, {"password": 0}).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
    users = []
    async for u in cursor:
        u["id"] = str(u["_id"])
        del u["_id"]
        det_count = await db.detections.count_documents({"user_id": u["id"]})
        u["detections"] = det_count
        users.append(u)
    return {"users": users, "total": total, "page": page}

@router.get("/stats")
async def get_stats(admin=Depends(get_admin_user)):
    db = get_db()
    total_users = await db.users.count_documents({})
    total_detections = await db.detections.count_documents({})
    return {"total_users": total_users, "total_detections": total_detections}

@router.get("/detection-stats")
async def get_detection_stats(admin=Depends(get_admin_user)):
    db = get_db()
    pipeline = [{"$group": {"_id": "$type", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    results = []
    async for doc in db.detections.aggregate(pipeline):
        results.append({"type": doc["_id"], "count": doc["count"]})
    return {"stats": results}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin=Depends(get_admin_user)):
    db = get_db()
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    await db.detections.delete_many({"user_id": user_id})
    return {"message": "User deleted"}

@router.put("/users/{user_id}/role")
async def update_role(user_id: str, body: dict, admin=Depends(get_admin_user)):
    db = get_db()
    role = body.get("role", "user")
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
    return {"message": "Role updated"}
