import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient

async def seed_data():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["emotionsense"]
    
    # Get test user
    user = await db.users.find_one({"email": "test@test.com"})
    if not user:
        print("User test@test.com not found. Please sign up first.")
        return

    user_id = str(user["_id"])
    print(f"Seeding data for user {user_id}")
    
    # Delete existing detections to start fresh
    await db.detections.delete_many({"user_id": user_id})

    emotions = ["happy", "sad", "angry", "surprised", "neutral", "fear", "disgust"]
    sources = ["face", "text", "audio", "fusion"]
    
    docs = []
    now = datetime.utcnow()
    
    # Generate ~200 random detections over the past 30 days
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
            "created_at": timestamp.isoformat(),
            "details": {
                "source": "Seeded data for dashboard demonstration"
            }
        }
        docs.append(doc)
        
    await db.detections.insert_many(docs)
    print(f"Successfully inserted {len(docs)} detection records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
