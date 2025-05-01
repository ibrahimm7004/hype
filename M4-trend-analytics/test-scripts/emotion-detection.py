from nrclex import NRCLex
from collections import Counter


def get_emotions(text: str) -> dict:
    lex = NRCLex(text)
    emotions = dict(Counter(lex.raw_emotion_scores))
    total = sum(emotions.values())
    if total == 0:
        return {}
    return {emotion: round(score / total, 3) for emotion, score in emotions.items()}


text = "I am so frustrated and upset right now."
print(get_emotions(text))
