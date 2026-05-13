import numpy as np
from typing import Dict

EMOTIONS = ["happy", "sad", "angry", "fear", "surprise", "neutral", "disgust", "anxiety", "stress", "excited"]

# Cache model to avoid reloading
_text_model = None
_text_tokenizer = None

def _load_text_model():
    global _text_model, _text_tokenizer
    if _text_model is not None:
        return _text_model, _text_tokenizer

    try:
        from transformers import pipeline
        _text_model = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None,
            truncation=True,
        )
        _text_tokenizer = True  # flag that model is loaded
        return _text_model, _text_tokenizer
    except Exception:
        return None, None

async def analyze_text(text: str) -> Dict:
    """
    Analyze emotion from text using HuggingFace transformer model.
    Falls back to keyword-based analysis if model unavailable.
    """
    try:
        model, loaded = _load_text_model()
        if model is not None:
            results = model(text[:512])
            if isinstance(results, list) and isinstance(results[0], list):
                results = results[0]

            # Map model output to our emotions
            label_map = {
                "joy": "happy", "sadness": "sad", "anger": "angry",
                "fear": "fear", "surprise": "surprise", "neutral": "neutral",
                "disgust": "disgust",
            }

            all_emotions = {}
            for res in results:
                label = res["label"].lower()
                mapped = label_map.get(label, label)
                if mapped in EMOTIONS:
                    all_emotions[mapped] = round(res["score"], 4)

            # Fill missing emotions
            for emo in EMOTIONS:
                if emo not in all_emotions:
                    all_emotions[emo] = round(np.random.uniform(0.001, 0.02), 4)

            total = sum(all_emotions.values())
            all_emotions = {k: round(v / total, 4) for k, v in all_emotions.items()}
            dominant = max(all_emotions, key=all_emotions.get)

            # Simple sentiment
            positive_emotions = {"happy", "excited", "surprise"}
            negative_emotions = {"sad", "angry", "fear", "disgust", "anxiety", "stress"}
            pos_score = sum(all_emotions.get(e, 0) for e in positive_emotions)
            neg_score = sum(all_emotions.get(e, 0) for e in negative_emotions)

            if pos_score > neg_score + 0.1:
                sentiment = "positive"
            elif neg_score > pos_score + 0.1:
                sentiment = "negative"
            else:
                sentiment = "neutral"

            sentiment_score = round(pos_score - neg_score, 4)

            return {
                "emotion": dominant,
                "confidence": all_emotions[dominant],
                "all_emotions": all_emotions,
                "sentiment": sentiment,
                "sentiment_score": sentiment_score,
            }
    except Exception:
        pass

    # Fallback: keyword-based analysis
    text_lower = text.lower()
    keyword_scores = {emo: 0.05 for emo in EMOTIONS}

    keywords = {
        "happy": ["happy", "joy", "great", "wonderful", "amazing", "love", "excited", "glad", "pleased", "delighted"],
        "sad": ["sad", "unhappy", "depressed", "crying", "tears", "miserable", "heartbroken", "grief", "sorrow"],
        "angry": ["angry", "furious", "rage", "mad", "annoyed", "irritated", "frustrated", "hate"],
        "fear": ["afraid", "scared", "terrified", "frightened", "anxious", "panic", "horror", "dread"],
        "surprise": ["surprised", "shocked", "amazed", "astonished", "unexpected", "wow"],
        "neutral": ["okay", "fine", "normal", "usual", "routine", "average"],
        "disgust": ["disgusting", "gross", "revolting", "nasty", "repulsive"],
        "anxiety": ["anxious", "worried", "nervous", "uneasy", "tense", "restless"],
        "stress": ["stressed", "overwhelmed", "pressure", "burnout", "exhausted", "overworked"],
        "excited": ["excited", "thrilled", "enthusiastic", "eager", "pumped", "hyped"],
    }

    for emo, words in keywords.items():
        for word in words:
            if word in text_lower:
                keyword_scores[emo] += 0.15

    total = sum(keyword_scores.values())
    all_emotions = {k: round(v / total, 4) for k, v in keyword_scores.items()}
    dominant = max(all_emotions, key=all_emotions.get)

    positive_emotions = {"happy", "excited", "surprise"}
    negative_emotions = {"sad", "angry", "fear", "disgust", "anxiety", "stress"}
    pos = sum(all_emotions.get(e, 0) for e in positive_emotions)
    neg = sum(all_emotions.get(e, 0) for e in negative_emotions)
    sentiment = "positive" if pos > neg + 0.05 else "negative" if neg > pos + 0.05 else "neutral"

    return {
        "emotion": dominant,
        "confidence": all_emotions[dominant],
        "all_emotions": all_emotions,
        "sentiment": sentiment,
        "sentiment_score": round(pos - neg, 4),
    }
