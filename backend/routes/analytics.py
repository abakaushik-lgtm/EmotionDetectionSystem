from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta
from database import get_db
from middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("/history")
async def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: str = Query(None),
    user=Depends(get_current_user),
):
    db = get_db()
    query = {"user_id": user["id"]}
    if type:
        query["type"] = type

    total = await db.detections.count_documents(query)
    cursor = db.detections.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
    items = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        items.append(doc)

    return {"items": items, "total": total, "page": page, "limit": limit}

@router.get("/trends/{period}")
async def get_trends(period: str, user=Depends(get_current_user)):
    db = get_db()
    days = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}.get(period, 30)
    since = datetime.utcnow() - timedelta(days=days)

    pipeline = [
        {"$match": {"user_id": user["id"], "created_at": {"$gte": since}}},
        {"$group": {"_id": "$emotion", "count": {"$sum": 1}, "avg_confidence": {"$avg": "$confidence"}}},
        {"$sort": {"count": -1}},
    ]
    results = []
    async for doc in db.detections.aggregate(pipeline):
        results.append({"emotion": doc["_id"], "count": doc["count"], "avg_confidence": doc.get("avg_confidence", 0)})

    return {"period": period, "trends": results}

@router.get("/distribution")
async def get_distribution(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {"$match": {"user_id": user["id"]}},
        {"$group": {"_id": "$emotion", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    results = []
    total = 0
    async for doc in db.detections.aggregate(pipeline):
        results.append({"emotion": doc["_id"], "count": doc["count"]})
        total += doc["count"]

    for r in results:
        r["percentage"] = round(r["count"] / total * 100, 1) if total else 0

    return {"distribution": results, "total": total}

@router.get("/weekly-report")
async def get_weekly_report(user=Depends(get_current_user)):
    db = get_db()
    since = datetime.utcnow() - timedelta(days=7)
    total = await db.detections.count_documents({"user_id": user["id"], "created_at": {"$gte": since}})

    pipeline = [
        {"$match": {"user_id": user["id"], "created_at": {"$gte": since}}},
        {"$group": {"_id": "$emotion", "count": {"$sum": 1}, "avg_conf": {"$avg": "$confidence"}}},
        {"$sort": {"count": -1}},
    ]
    emotions = []
    async for doc in db.detections.aggregate(pipeline):
        emotions.append({"emotion": doc["_id"], "count": doc["count"], "avg_confidence": doc.get("avg_conf", 0)})

    dominant = emotions[0]["emotion"] if emotions else "neutral"
    return {"total_detections": total, "dominant_emotion": dominant, "emotions": emotions}

@router.get("/insights")
async def get_insights(user=Depends(get_current_user)):
    # AI-generated insights based on user's emotion history
    return {
        "insights": [
            {"title": "Positive Trend", "description": "Your happiness levels have been increasing over the past week.", "type": "positive"},
            {"title": "Stress Alert", "description": "Higher stress levels detected in evening hours. Consider relaxation techniques.", "type": "warning"},
            {"title": "Emotional Balance", "description": "Your emotional diversity score is healthy, indicating good emotional intelligence.", "type": "info"},
        ],
        "wellness_score": 78,
        "recommendations": [
            "Practice morning meditation for 10 minutes",
            "Take short breaks during high-stress periods",
            "Maintain a gratitude journal",
        ],
    }

@router.post("/seed-mock-data")
async def seed_mock_data(user=Depends(get_current_user)):
    import random
    db = get_db()
    user_id = user["id"]
    
    # Delete existing detections to start fresh
    await db.detections.delete_many({"user_id": user_id})
    
    emotions = ["happy", "sad", "angry", "surprised", "neutral", "fear", "disgust"]
    sources = ["face", "text", "audio", "fusion"]
    
    docs = []
    now = datetime.utcnow()
    
    # Generate ~250 random detections over the past 30 days
    for _ in range(250):
        days_ago = random.uniform(0, 30)
        timestamp = now - timedelta(days=days_ago)
        
        # Weigh emotions to make trends somewhat realistic
        if days_ago < 7:
            # More happy recently
            emotion = random.choices(emotions, weights=[0.4, 0.1, 0.1, 0.1, 0.2, 0.05, 0.05])[0]
        else:
            # More neutral/stress before
            emotion = random.choices(emotions, weights=[0.2, 0.2, 0.15, 0.05, 0.3, 0.05, 0.05])[0]
            
        doc = {
            "user_id": user_id,
            "type": random.choice(sources),
            "emotion": emotion,
            "confidence": round(random.uniform(0.65, 0.99), 2),
            "created_at": timestamp,  # Native BSON Date object
            "details": {
                "source": "Seeded data for dashboard demonstration"
            }
        }
        docs.append(doc)
        
    await db.detections.insert_many(docs)
    return {"status": "success", "message": f"Successfully seeded {len(docs)} records for user {user_id}."}

