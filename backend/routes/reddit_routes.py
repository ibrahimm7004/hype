from flask import Flask, request, jsonify, redirect, Blueprint
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()



# # Reddit App Credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_REDIRECT_URI = os.getenv("REDDIT_REDIRECT_URI")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")
ACCESS_TOKEN = os.getenv("REDDIT_ACCESS_TOKEN")


# Store user tokens (Ideally, use a database)
user_tokens = {}

reddit_bp = Blueprint("reddit", __name__)  # Define the blueprint


# Step 1: Get Reddit authentication URL
@reddit_bp.route('/login', methods=['POST'])
def auth():
    print("Reddit Auth")
    auth_url = (
        f"https://www.reddit.com/api/v1/authorize?"
        f"REDDIT_CLIENT_ID={REDDIT_CLIENT_ID}&response_type=code&state=randomstring123&"
        f"REDDIT_REDIRECT_URI={REDDIT_REDIRECT_URI}&duration=permanent&"
        f"scope=identity submit"
    )
    return jsonify({"auth_url": auth_url})

# Step 2: Handle Reddit callback and get access token
@reddit_bp.route('/callback', methods=['GET'])
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    # Exchange code for access token
    auth_header = base64.b64encode(f"{REDDIT_CLIENT_ID}:{REDDIT_CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "User-Agent": REDDIT_USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "REDDIT_REDIRECT_URI": REDDIT_REDIRECT_URI,
    }
    response = requests.post("https://www.reddit.com/api/v1/access_token", headers=headers, data=data)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to get access token", "details": response.json()}), 400

    token_info = response.json()
    user_tokens["access_token"] = token_info["access_token"]
    user_tokens["refresh_token"] = token_info.get("refresh_token")

    return jsonify({"message": "Authenticated successfully", "access_token": token_info["access_token"]})

# Step 3: Fetch user profile
@reddit_bp.route('/profile', methods=['GET'])
def profile():
    # access_token = user_tokens.get("access_token")

    access_token = ACCESS_TOKEN

    
    if not access_token:
        return jsonify({"error": "User not authenticated"}), 401

    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": REDDIT_USER_AGENT,
    }
    response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile", "details": response.json()}), 400

    return jsonify(response.json())

# Step 4: Post to Reddit profile
@reddit_bp.route('/post', methods=['POST'])
def post_content():
    access_token = user_tokens.get("access_token")
    if not access_token:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.json
    title = data.get("title")
    text = data.get("text")

    if not title or not text:
        return jsonify({"error": "Title and text are required"}), 400

    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": REDDIT_USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    post_data = {
        "title": title,
        "text": text,
        "sr": "u_" + profile().json().get("name"),  # Post to user's profile
        "kind": "self",
    }
    response = requests.post("https://oauth.reddit.com/api/submit", headers=headers, data=post_data)

    if response.status_code != 200:
        return jsonify({"error": "Failed to create post", "details": response.json()}), 400

    return jsonify(response.json())
