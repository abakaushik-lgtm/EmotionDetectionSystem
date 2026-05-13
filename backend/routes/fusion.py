from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from middleware.auth_middleware import get_current_user
from services.fusion_service import run_fusion

router = APIRouter()

class FusionRequest(BaseModel):
    face_result: Optional[dict] = None
    audio_result: Optional[dict] = None
    text_result: Optional[dict] = None

@router.post("/fusion")
async def detect_fusion(data: FusionRequest, user=Depends(get_current_user)):
    result = await run_fusion(
        face_result=data.face_result,
        audio_result=data.audio_result,
        text_result=data.text_result,
    )

    db = get_db()
    await db.detections.insert_one({
        "user_id": user["id"],
        "type": "fusion",
        "emotion": result["final_emotion"],
        "confidence": result["final_confidence"],
        "modalities": result["modalities"],
        "weights": result["weights"],
        "created_at": datetime.utcnow().isoformat(),
    })

    return result
