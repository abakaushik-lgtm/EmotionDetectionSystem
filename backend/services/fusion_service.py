from typing import Dict, Optional

# Default weights for each modality
DEFAULT_WEIGHTS = {
    "face": 0.45,
    "audio": 0.25,
    "text": 0.30,
}

async def run_fusion(
    face_result: Optional[Dict] = None,
    audio_result: Optional[Dict] = None,
    text_result: Optional[Dict] = None,
) -> Dict:
    """
    Weighted ensemble fusion of multimodal emotion predictions.
    Combines face, audio, and text predictions using configurable weights.
    """
    modalities = []
    active_weights = {}

    if face_result and "emotion" in face_result:
        modalities.append({"source": "face", "emotion": face_result["emotion"], "confidence": face_result.get("confidence", 0.5), "all_emotions": face_result.get("all_emotions", {})})
        active_weights["face"] = DEFAULT_WEIGHTS["face"]

    if audio_result and "emotion" in audio_result:
        modalities.append({"source": "audio", "emotion": audio_result["emotion"], "confidence": audio_result.get("confidence", 0.5), "all_emotions": audio_result.get("all_emotions", {})})
        active_weights["audio"] = DEFAULT_WEIGHTS["audio"]

    if text_result and "emotion" in text_result:
        modalities.append({"source": "text", "emotion": text_result["emotion"], "confidence": text_result.get("confidence", 0.5), "all_emotions": text_result.get("all_emotions", {})})
        active_weights["text"] = DEFAULT_WEIGHTS["text"]

    if not modalities:
        return {"final_emotion": "neutral", "final_confidence": 0.0, "modalities": [], "weights": DEFAULT_WEIGHTS}

    # Normalize weights for active modalities
    total_weight = sum(active_weights.values())
    normalized_weights = {k: v / total_weight for k, v in active_weights.items()}

    # Weighted fusion of all emotion scores
    fused_scores = {}
    for mod in modalities:
        weight = normalized_weights.get(mod["source"], 0)
        all_emos = mod.get("all_emotions", {mod["emotion"]: mod["confidence"]})
        for emotion, score in all_emos.items():
            fused_scores[emotion] = fused_scores.get(emotion, 0) + score * weight * mod["confidence"]

    # Normalize fused scores
    total = sum(fused_scores.values()) or 1
    fused_scores = {k: round(v / total, 4) for k, v in fused_scores.items()}

    # Get dominant emotion
    final_emotion = max(fused_scores, key=fused_scores.get)
    final_confidence = fused_scores[final_emotion]

    return {
        "final_emotion": final_emotion,
        "final_confidence": final_confidence,
        "all_emotions": fused_scores,
        "modalities": [{"source": m["source"], "emotion": m["emotion"], "confidence": m["confidence"]} for m in modalities],
        "weights": normalized_weights,
    }
