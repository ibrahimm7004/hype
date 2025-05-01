from flask import Blueprint, request, jsonify
import os
import openai
from dotenv import load_dotenv
import requests
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords



# Load environment variables and setup OpenAI
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_KEY"))
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))


trends_bp = Blueprint("trends", __name__)

allowed_features = [
    "polarity_score",
    "sentiment_label",
    "emotions",
    "subjectivity_score",
    "hateful_speech",
    "sarcasm",
    "engagement_prediction"
]

feature_prompts = {
    "polarity_score": "Return a polarity score between -1 and 1 indicating how negative or positive the sentiment is.",
    "sentiment_label": "Classify the sentiment as 'positive', 'negative', or 'neutral'.",
    "emotions": "List the top 1–3 dominant emotions expressed.",
    "subjectivity_score": "Return a subjectivity score from 0 (objective) to 1 (fully subjective).",
    "hateful_speech": "Does the text contain hateful or abusive speech? Respond with 'yes' or 'no'.",
    "sarcasm": "Is the text sarcastic or ironic in tone? Respond with 'yes' or 'no'.",
    "engagement_prediction": "Predict the likelihood that this text would get high engagement (likes/comments/shares) on social media. Respond with 'high', 'medium', or 'low'."
}


@trends_bp.route("/sentiment", methods=["POST"])
def analyze_sentiment():
    data = request.get_json()

    text = data.get("text")
    feature = data.get("feature")

    if not text or not feature:
        return jsonify({"error": "Both 'text' and 'feature' are required."}), 400

    if feature not in allowed_features:
        return jsonify({
            "error": f"Unsupported feature '{feature}'. Must be one of: {allowed_features}"
        }), 400

    prompt = (
        f"Analyze the following text and {feature_prompts[feature]}\n"
        f"Text: \"{text}\"\n"
        f"Only return the {feature.replace('_', ' ')}, no explanation."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[{"role": "user", "content": prompt}]
        )
        result = response.choices[0].message.content.strip()
        return jsonify({
            "feature": feature,
            "value": result,
            "text": text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@trends_bp.route("/reddit-trends", methods=["GET"])
def reddit_trends():
    topic = request.args.get("topic")
    limit = int(request.args.get("limit", 500))

    if not topic:
        return jsonify({"error": "Missing 'topic' query parameter"}), 400

    headers = {'User-Agent': 'trend-analyzer/0.1'}
    url = f"https://www.reddit.com/search.json?q={topic}&sort=top&t=week&limit={limit}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from Reddit"}), 500

    posts = response.json().get('data', {}).get('children', [])
    titles = [post['data']['title'] for post in posts]

    words = re.findall(r'\b\w{4,}\b', ' '.join(titles).lower())
    filtered_words = [w for w in words if w not in stop_words]
    top_keywords = Counter(filtered_words).most_common(15)

    return jsonify({
        "topic": topic,
        "top_keywords": [{"word": word, "count": count} for word, count in top_keywords]
    })


@trends_bp.route("/get-trends", methods=["POST"])
def get_trends_endpoint():
    # Extract parameters from query parameters
    data = request.get_json()

    social_media = data.get("social_media")
    location = data.get("location")
    trend_type = data.get("trend_type")
    num = int(data.get("num", 10))  # Default to 10 if not provided

    # Check for missing parameters
    if not social_media or not location or not trend_type:
        return jsonify({"error": "Missing required parameters: social_media, location, and trend_type."}), 400

    try:
        # Define the prompt
        prompt = (
            f"List the top {num} trending {trend_type} on {social_media} in {location} right now. "
            f"Return only a comma-separated list, no explanation."
        )

        # Call OpenAI API to get the response
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "You are a trend analysis assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        # Process the response
        raw_text = response.choices[0].message.content.strip()
        trends = [trend.strip()[:40] for trend in raw_text.split(',') if trend.strip()]
        return jsonify({"trends": trends[:num]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500