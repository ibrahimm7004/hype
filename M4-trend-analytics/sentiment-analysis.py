import os
from dotenv import load_dotenv
import openai

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_KEY"))


def get_sentiment_feature(sentiment_feature: str, text: str):
    allowed_features = [
        "polarity_score",
        "sentiment_label",
        "emotions",
        "subjectivity_score",
        "hateful_speech",
        "sarcasm",
        "engagement_prediction"
    ]

    if sentiment_feature not in allowed_features:
        raise ValueError(
            f"Unsupported feature '{sentiment_feature}'. Must be one of: {allowed_features}")

    feature_prompts = {
        "polarity_score": "Return a polarity score between -1 and 1 indicating how negative or positive the sentiment is.",
        "sentiment_label": "Classify the sentiment as 'positive', 'negative', or 'neutral'.",
        "emotions": "List the top 1–3 dominant emotions expressed.",
        "subjectivity_score": "Return a subjectivity score from 0 (objective) to 1 (fully subjective).",
        "hateful_speech": "Does the text contain hateful or abusive speech? Respond with 'yes' or 'no'.",
        "sarcasm": "Is the text sarcastic or ironic in tone? Respond with 'yes' or 'no'.",
        "engagement_prediction": "Predict the likelihood that this text would get high engagement (likes/comments/shares) on social media. Respond with 'high', 'medium', or 'low'."
    }

    prompt = (
        f"Analyze the following text and {feature_prompts[sentiment_feature]}\n"
        f"Text: \"{text}\"\n"
        f"Only return the {sentiment_feature.replace('_', ' ')}, no explanation."
    )

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()


# example usage:
# text = "I'm absolutely thrilled with the results!"
# print("Polarity Score:", get_sentiment_feature("polarity_score", text))
# print("Label:", get_sentiment_feature("sentiment_label", text))
# print("Emotions:", get_sentiment_feature("emotions", text))
# print("Subjectivity:", get_sentiment_feature("subjectivity_score", text))
text2 = "Yeah, great job on completely ruining my day 🙃"
print("Sarcasm:", get_sentiment_feature("sarcasm", text2))
print("Hateful Speech:", get_sentiment_feature("hateful_speech", text2))
print("Engagement Prediction:", get_sentiment_feature(
    "engagement_prediction", text2))
