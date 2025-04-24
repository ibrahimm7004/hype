from flask import Flask, request, jsonify, Blueprint, redirect, url_for
import requests
import base64
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from mydatabase.models import db, RedditUserToken, RedditPostSchedule  # Import the RedditUserToken model
from routes.cloudinary_routes import cloudinary_upload
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,get_jwt
)
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
def reddit_auth():
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    


    auth_url = (
        f"https://www.reddit.com/api/v1/authorize?"
        f"client_id={REDDIT_CLIENT_ID}&response_type=code&state={user_id}&"
        f"redirect_uri={REDDIT_REDIRECT_URI}&duration=permanent&"
        f"scope=identity submit history"
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
@jwt_required()
def profile():
    user_id = get_jwt_identity()
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


@reddit_bp.route('/schedule-post', methods=['POST'])
@jwt_required()
def schedule_post():
    """Schedules a Reddit post."""
    data = request.form
    user_id = get_jwt_identity()
    title = data.get("title")
    text = data.get("text")
    scheduled_time = data.get("scheduled_time")  # Expecting YYYY-MM-DD HH:MM:SS format
    image = request.files.get("image")


    if not user_id or not title or not scheduled_time:
        return jsonify({"error": "User ID, title, and scheduled time are required"}), 400

    # Convert scheduled_time to datetime
    try:
        scheduled_time = datetime.strptime(scheduled_time, "%Y-%m-%dT%H:%M")
    except ValueError:
        return jsonify({"error": "Invalid scheduled time format"}), 400

    image_url = None
    if image:
        img_upload_res = cloudinary_upload(image)
        if img_upload_res:
            image_url = img_upload_res.get("secure_url")
        else:
            return jsonify({"error": "Image upload failed"}), 400

    # Save post schedule in DB
    new_post = RedditPostSchedule(
        title=title,
        subreddit=f"u_{user_id}",  # Assuming user posts on their profile
        kind="link" if image_url else "self",
        url=image_url,
        text=text,
        scheduled_time=scheduled_time,
        posted=False
    )
    print(new_post.title)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Post scheduled successfully", "post_id": new_post.id}), 201


@reddit_bp.route('/post', methods=['POST'])
@jwt_required()
def post_content():
    data = request.form
    user_id = get_jwt_identity()
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


@reddit_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    print("[DEBUG] Received request for user posts")
    
    user_id = get_jwt_identity()
    print(f"[DEBUG] Extracted user_id: {user_id}")
    
    if not user_id:
        print("[ERROR] No user ID provided")
        return jsonify({"error": "User ID is required"}), 400

    user_token = get_user_token(user_id)
    print(f"[DEBUG] Retrieved user token: {user_token}")
    
    if not user_token:
        print("[ERROR] User not authenticated")
        return jsonify({"error": "User not authenticated"}), 401

    access_token = user_token.access_token
    print(f"[DEBUG] Initial access token: {access_token}")
    
    if user_token.is_token_expired():
        print("[DEBUG] Token expired, refreshing token...")
        access_token = refresh_access_token(user_id)
        print(f"[DEBUG] New access token: {access_token}")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": REDDIT_USER_AGENT,
    }
    print(f"[DEBUG] Request headers: {headers}")

    # Get the authenticated username from Reddit API
    profile_response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
    print(f"[DEBUG] Profile API response: {profile_response.status_code}")
    print(f"[DEBUG] Profile API response body: {profile_response.text}")

    if profile_response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile", "details": profile_response.json()}), 400

    reddit_username = profile_response.json().get("name")
    print(f"[DEBUG] Extracted Reddit username: {reddit_username}")
    
    if not reddit_username:
        print("[ERROR] Could not retrieve Reddit username")
        return jsonify({"error": "Could not retrieve Reddit username"}), 400

    # Fetch user posts
    posts_url = f"https://oauth.reddit.com/user/Sea_Lifeguard_4902/submitted"
    print(f"[DEBUG] Fetching posts from URL: {posts_url}")
    response = requests.get(posts_url, headers=headers)
    
    print(f"[DEBUG] Posts API response: {response.status_code}")
    print(f"[DEBUG] Posts API response body: {response.text}")

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch user posts", "details": response.json()}), 400

    return jsonify(response.json())
