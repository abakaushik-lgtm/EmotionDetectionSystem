from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from middleware.auth_middleware import get_current_user
from services.text_service import analyze_text

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/text")
async def detect_text_emotion(data: TextRequest, user=Depends(get_current_user)):
    result = await analyze_text(data.text)

    db = get_db()
    await db.detections.insert_one({
        "user_id": user["id"],
        "type": "text",
        "emotion": result["emotion"],
        "confidence": result["confidence"],
        "sentiment": result["sentiment"],
        "sentiment_score": result["sentiment_score"],
        "all_emotions": result["all_emotions"],
        "text_preview": data.text[:100],
        "created_at": datetime.utcnow().isoformat(),
    })

    return result
