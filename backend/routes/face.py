from fastapi import APIRouter, UploadFile, File, Depends
from datetime import datetime
from database import get_db
from middleware.auth_middleware import get_current_user
from services.face_service import analyze_face

router = APIRouter()

@router.post("/face")
async def detect_face_emotion(file: UploadFile = File(...), user=Depends(get_current_user)):
    contents = await file.read()
    result = await analyze_face(contents)

    # Save to history
    db = get_db()
    await db.detections.insert_one({
        "user_id": user["id"],
        "type": "face",
        "emotion": result["emotion"],
        "confidence": result["confidence"],
        "all_emotions": result["all_emotions"],
        "created_at": datetime.utcnow(),
    })

    return result
