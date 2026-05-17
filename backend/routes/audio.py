from fastapi import APIRouter, UploadFile, File, Depends
from datetime import datetime
from database import get_db
from middleware.auth_middleware import get_current_user
from services.audio_service import analyze_audio

router = APIRouter()

@router.post("/audio")
async def detect_audio_emotion(file: UploadFile = File(...), user=Depends(get_current_user)):
    contents = await file.read()
    result = await analyze_audio(contents, file.filename or "audio.wav")

    db = get_db()
    await db.detections.insert_one({
        "user_id": user["id"],
        "type": "audio",
        "emotion": result["emotion"],
        "confidence": result["confidence"],
        "all_emotions": result["all_emotions"],
        "created_at": datetime.utcnow(),
    })

    return result
