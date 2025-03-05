from flask import Flask, request, jsonify, Blueprint, redirect, url_for
import requests
import base64
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from mydatabase.models import db, RedditUserToken  # Import the RedditUserToken model
from routes.cloudinary_routes import cloudinary_upload
# Load environment variables
load_dotenv()

# Reddit App Credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_REDIRECT_URI = os.getenv("REDDIT_REDIRECT_URI")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

reddit_bp = Blueprint("reddit", __name__)  # Define the blueprint


def get_user_token(user_id):
    """Retrieve the latest Reddit token for a user"""
    return RedditUserToken.query.filter_by(user_id=user_id).first()


def refresh_access_token(user_id):
    """Refresh expired Reddit access token"""
    user_token = get_user_token(user_id)
    if not user_token or not user_token.refresh_token:
        return None  # No refresh token available

    auth_header = base64.b64encode(f"{REDDIT_CLIENT_ID}:{REDDIT_CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "User-Agent": REDDIT_USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "refresh_token",
        "refresh_token": user_token.refresh_token,
    }

    response = requests.post("https://www.reddit.com/api/v1/access_token", headers=headers, data=data)
    if response.status_code == 200:
        token_info = response.json()
        user_token.access_token = token_info["access_token"]
        user_token.token_expires_at = datetime.utcnow() + timedelta(seconds=3600)
        db.session.commit()
        return token_info["access_token"]
    return None


# Step 1: Get Reddit authentication URL
@reddit_bp.route('/login', methods=['POST'])
def auth():
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    auth_url = (
        f"https://www.reddit.com/api/v1/authorize?"
        f"client_id={REDDIT_CLIENT_ID}&response_type=code&state={user_id}&"
        f"redirect_uri={REDDIT_REDIRECT_URI}&duration=permanent&"
        f"scope=identity submit"
    )
    return jsonify({"auth_url": auth_url})


# Step 2: Handle Reddit callback and store tokens
@reddit_bp.route('/callback', methods=['GET'])
def callback():
    code = request.args.get('code')
    user_id = request.args.get('state')  # State stores user_id
    
    print("Code:", code)  # Debugging
    print("User ID:", user_id)  # Debugging
    if not code or not user_id:
        return jsonify({"error": "Authorization code or user ID missing"}), 400

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
        "redirect_uri": REDDIT_REDIRECT_URI,
    }

    response = requests.post("https://www.reddit.com/api/v1/access_token", headers=headers, data=data)
    if response.status_code != 200:
        return jsonify({"error": "Failed to get access token", "details": response.json()}), 400

    token_info = response.json()

    # Fetch user's Reddit username
    headers = {
        "Authorization": f"Bearer {token_info['access_token']}",
        "User-Agent": REDDIT_USER_AGENT,
    }
    profile_response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
    if profile_response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile", "details": profile_response.json()}), 400

    reddit_profile = profile_response.json()
    reddit_user_id = reddit_profile.get("id")
    reddit_username = reddit_profile.get("name")

    # Store in database
    existing_user = get_user_token(user_id)
    if existing_user:
        existing_user.access_token = token_info["access_token"]
        existing_user.refresh_token = token_info.get("refresh_token")
        existing_user.token_expires_at = datetime.utcnow() + timedelta(seconds=3600)
        existing_user.updated_at = datetime.utcnow()
    else:
        new_user = RedditUserToken(
            user_id=user_id,
            reddit_user_id=reddit_user_id,
            username=reddit_username,
            access_token=token_info["access_token"],
            refresh_token=token_info.get("refresh_token"),
            token_expires_at=datetime.utcnow() + timedelta(seconds=3600),
        )
        db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Authenticated successfully"})


# Step 3: Fetch user profile
@reddit_bp.route('/profile', methods=['GET'])
def profile():
    user_id = request.args.get("user_id")
    print("User ID:", user_id)  # Debugging
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user_token = get_user_token(user_id)
    if not user_token:
        return jsonify({"error": "User not authenticated"}), 401

    access_token = user_token.access_token
    if user_token.is_token_expired():
        access_token = refresh_access_token(user_id)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": REDDIT_USER_AGENT,
    }
    response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile", "details": response.json()}), 400

    return jsonify(response.json())

@reddit_bp.route('/post', methods=['POST'])
def post_content():
    data = request.form
    user_id = request.args.get("user_id")
    title = data.get("title")
    text = data.get("text")
    
    image = request.files.get("image")
    image_url = None

    if not user_id or not title:
        return jsonify({"error": "User ID and title are required"}), 400

    user_token = get_user_token(user_id)
    if not user_token:
        return jsonify({"error": "User not authenticated"}), 401

    access_token = user_token.access_token
    if user_token.is_token_expired():
        access_token = refresh_access_token(user_id)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": REDDIT_USER_AGENT,
    }

    profile_response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
    if profile_response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile", "details": profile_response.json()}), 400

    reddit_username = profile_response.json().get("name")

    if image:
        # Assuming cloudinary_upload is a function you have for uploading the image
        img_upload_res = cloudinary_upload(image)
        if img_upload_res:
            image_url = img_upload_res.get("secure_url")
            print("Image upload result:", img_upload_res)
        else:
            return jsonify({"error": "Image upload failed"}), 400

    # # Fallback image URL if no upload occurs
    # if not image_url:
    #     image_url = 'https://res.cloudinary.com/doh1eotn4/image/upload/v1741175162/ckuyyhen4qlyshujydrh.jpg'

    post_data = {
        "title": title,
        "sr": f"u_{reddit_username}",
        "kind": "link" if image_url else "self",
        "url": image_url,
    }

    if text:
        post_data["text"] = text

    response = requests.post("https://oauth.reddit.com/api/submit", headers=headers, data=post_data)

    if response.status_code != 200:
        return jsonify({"error": "Failed to create post", "details": response.json()}), 400

    return jsonify({"data": response.json(), "message": "Post created successfully"}), 200

