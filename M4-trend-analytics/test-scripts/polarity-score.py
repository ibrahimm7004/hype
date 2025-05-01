from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def get_polarity_score(text: str) -> float:
    score = analyzer.polarity_scores(text)
    return round(score['compound'], 4)  # -1 to 1


def get_sentiment_label(text: str) -> str:
    polarity = get_polarity_score(text)
    if polarity >= 0.05:
        return "positive"
    elif polarity <= -0.05:
        return "negative"
    else:
        return "neutral"


text = "This service is okay, not great but not bad either."

print("Polarity:", get_polarity_score(text))
print("Sentiment Label:", get_sentiment_label(text))
