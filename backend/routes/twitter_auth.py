from flask import Blueprint, request, jsonify, redirect, session, url_for
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,get_jwt
)
import requests

from requests_oauthlib import OAuth1
from flask_cors import CORS, cross_origin
from datetime import timedelta
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

from mydatabase.models import ScheduledTweet, UserToken
from mydatabase.database import db
from services.twitter_util import post_tweet, get_twitter_auth_from_user_id

import os


import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

twitter_bp = Blueprint("twitter", __name__)  # Define the blueprint
# Load environment variables
load_dotenv()
# # Twitter API credentials
TWITTER_JWT_SECRET = "twitter_secret_key"
JWT_EXPIRATION = 36000  # 1 hour
JWT_ALGORITHM = "HS256"

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

TWITTER_JWT_SECRET = os.getenv("TWITTER_JWT_SECRET")
JWT_EXPIRATION = os.getenv("JWT_EXPIRATION")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
# Twitter API endpoints
REQUEST_TOKEN_URL = "https://api.twitter.com/oauth/request_token"
AUTHENTICATE_URL = "https://api.twitter.com/oauth/authenticate"
ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token"
USER_INFO_URL = "https://api.twitter.com/1.1/account/verify_credentials.json"
POST_TWEET_URL = "https://api.twitter.com/2/tweets"
UPLOAD_MEDIA_URL = 'https://upload.twitter.com/1.1/media/upload.json'


TWITTER_TOKEN_EXPIRATION = 365  # 1 hour



@twitter_bp.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def twitter_login():
    data = request.get_json()
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400   
    
    """Get Twitter OAuth token & return JWT"""
    oauth = OAuth1(CLIENT_ID, CLIENT_SECRET)
    response = requests.post(REQUEST_TOKEN_URL, auth=oauth)

    if response.status_code != 200:
        return jsonify({"error": "Error fetching request token"}), 400

    credentials = dict(x.split("=") for x in response.text.split("&"))

    auth_url = f"{AUTHENTICATE_URL}?oauth_token={credentials.get('oauth_token')}"
    
    return jsonify({"auth_url": auth_url, "oauth_token":credentials.get("oauth_token")}),200




@twitter_bp.route("/callback", methods=["GET"])
@jwt_required()
def callback():
    """ Step 2: Exchange verifier for Access Token and store it """

    oauth_token = request.args.get("oauth_token")
    oauth_verifier = request.args.get("oauth_verifier")

    if not oauth_token or not oauth_verifier:
        return jsonify({"error": "Missing credentials"}), 400

    user_id = get_jwt_identity()  # Get user ID from JWT

    # Exchange OAuth verifier for final access token
    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        oauth_token, verifier=oauth_verifier
    )
    response = requests.post(ACCESS_TOKEN_URL, auth=oauth)

    if response.status_code != 200:
        return jsonify({"error": "Error fetching access token"}), 400

    # Parse response data
    credentials = dict(x.split("=") for x in response.text.split("&"))
    twitter_user_id = credentials.get("user_id")
    screen_name = credentials.get("screen_name")
    access_token = credentials.get("oauth_token")
    access_token_secret = credentials.get("oauth_token_secret")

    if not all([twitter_user_id, screen_name, access_token, access_token_secret]):
        return jsonify({"error": "Invalid response from Twitter"}), 400

    # Store or update the Twitter credentials in DB
    existing_token = UserToken.query.filter_by(user_id=user_id).first()

    if existing_token:
        existing_token.twitter_user_id = twitter_user_id
        existing_token.screen_name = screen_name
        existing_token.oauth_token = access_token
        existing_token.oauth_token_secret = access_token_secret
        existing_token.updated_at = datetime.utcnow()
    else:
        new_token = UserToken(
            user_id=user_id,
            twitter_user_id=twitter_user_id,
            screen_name=screen_name,
            oauth_token=access_token,
            oauth_token_secret=access_token_secret,
            created_at=datetime.utcnow()
        )
        db.session.add(new_token)

    db.session.commit()

    return jsonify({"message": "Access token saved successfully!"}), 200


@twitter_bp.route("/refresh-token", methods=["POST"])
@jwt_required()
def refresh_access_token():
    """Generate a new access token using stored refresh token"""
    current_user = get_jwt_identity()
    user_token = UserToken.query.filter_by(user_id=current_user).first()

    if not user_token:
        return jsonify({"error": "Refresh token not found. Please re-authenticate."}), 401

    # Use stored refresh token to get a new access token
    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        resource_owner_key=user_token.refresh_token
    )

    response = requests.post(ACCESS_TOKEN_URL, auth=oauth)

    if response.status_code != 200:
        return jsonify({"error": "Failed to refresh access token"}), 400

    credentials = dict(x.split("=") for x in response.text.split("&"))

    # Generate new access token
    payload = {
        "access_token": credentials["oauth_token"],
        "access_token_secret": credentials["oauth_token_secret"],
        "exp": datetime.utcnow() + timedelta(days=TWITTER_TOKEN_EXPIRATION), 
    }
    # new_jwt_token = jwt.encode(payload, TWITTER_JWT_SECRET, algorithm=JWT_ALGORITHM)
    new_jwt_token = create_access_token(identity=current_user, additional_claims=payload)


    return jsonify({"access_token": new_jwt_token})









@twitter_bp.route("/profile", methods=["GET"])
def profile():
    """ Fetch user profile """
    oauth_token = request.args.get("oauth_token")
    auth_header = request.headers.get("Authorization")
    # return jsonify({"message": "Callback received successfully!"}), 200
    

    if not oauth_token or not auth_header:
        return jsonify({"error": "Missing credentials"}), 400
    
    # print("auth_header:", auth_header)
    jwt_token = auth_header.split(" ")[1]  # ✅ Extract actual token
    print("jwt_token:", jwt_token)
    jwt_token = jwt_token.encode("utf-8")

    # Decode JWT to get stored OAuth tokens
    try:
        # decoded_token = jwt.decode(jwt_token, TWITTER_JWT_SECRET, algorithms=[JWT_ALGORITHM])
        decoded_token = get_jwt_identity()
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    # except jwt.ExpiredSignatureError:
    #     return jsonify({"error": "Token expired. Please login again."}), 401
    # except jwt.InvalidTokenError:
    #     return jsonify({"error": "Invalid token"}), 401
    

    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        decoded_token["access_token"], decoded_token["access_token_secret"]
    )

    response = requests.get(USER_INFO_URL, auth=oauth)
    if response.status_code != 200:
        return "Error fetching user data", 400

    user_data = response.json()
    return jsonify({"user": user_data})




@twitter_bp.route("/tweet", methods=["POST"])
@jwt_required()
def tweet():
    """Post a tweet with an optional image"""

    # oauth_token = request.args.get("oauth_token")
    auth_header = request.headers.get("Authorization")

    tweet_text = request.form.get("tweet_text")
    image_file = request.files.get("image")  # Get the image file from the form

    if  not auth_header:
        return jsonify({"error": "Missing credentials"}), 400

    try:
        user_id = get_jwt_identity()
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    
    try:
        decoded_token = get_twitter_auth_from_user_id(user_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    if not decoded_token:
        return jsonify({"error": "Twitter credentials not found please authenticate your account with api"}), 400
    
    access_token = decoded_token["access_token"]
    access_token_secret = decoded_token["access_token_secret"]
    
    return post_tweet(decoded_token, tweet_text, image_file, access_token, access_token_secret)  # Call the utility function


@twitter_bp.route("/schedule-tweet", methods=["POST"])
def schedule_tweet():
    """Schedule a tweet for later posting."""
    data = request.get_json(force=True)  # Force parsing JSON to avoid raw bytes issue

    # print("request data:", data)
    user_id = data['user_id']  # User identifier
    
    tweet_text = data['tweet_text']
    scheduled_time = data['scheduled_time']  # Expected format: YYYY-MM-DD HH:MM:SS
    image_file = data["image_url"]
    # print("debugging user_id:", user_id)
    # print("debugging tweet_text:", tweet_text)
    # print("debugging scheduled_time:", scheduled_time)
    # print("debugging image_file:", image_file)
    # return jsonify({"message": "Tweet scheduled successfully!"}), 200

    if not user_id or not tweet_text or not scheduled_time :
        return jsonify({"error": "Missing required fields"}), 400

    try:
        scheduled_time = datetime.strptime(scheduled_time, "%Y-%m-%dT%H:%M")  # No seconds
        print("Parsed DateTime:", scheduled_time)
    except ValueError:
        return jsonify({"error": "Invalid datetime format"}), 400

    print("Scheduled Time:", scheduled_time)
    # if scheduled_time < datetime.now():
    #     return jsonify({"error": "Scheduled time must be in the future"}), 400
    # Upload image if provided
    image_url = None
    # image_url = 'https://res.cloudinary.com/doh1eotn4/image/upload/v1740178110/zs84nivaopyr5serx6af.png'
    if image_file:
        
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            print("Upload Result:", upload_result)
            image_url = upload_result.get("secure_url")
            print("Image URL:", image_url)
        except Exception as e:
            return jsonify({"error": "Failed to upload image to cloudinary"}), 400
    # return jsonify({"message": "Tweet scheduled successfully!"}), 200
        

    # Save to database
    scheduled_tweet = ScheduledTweet(
        user_id=user_id,
        tweet_text=tweet_text,
        image_url=image_url,
        scheduled_time=scheduled_time,
        posted=False
    )
    db.session.add(scheduled_tweet)
    db.session.commit()

    return jsonify({"message": "Tweet scheduled successfully!"}), 200


@twitter_bp.route("/scheduled-tweets", methods=["GET"])
def get_scheduled_tweets():
    """Get all scheduled tweets for the user."""
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    tweets = ScheduledTweet.query.filter_by(user_id=user_id).all()
    scheduled_tweets = []
    for tweet in tweets:
        scheduled_tweets.append({
            "id": tweet.id,
            "tweet_text": tweet.tweet_text,
            "image_url": tweet.image_url,
            "scheduled_time": tweet.scheduled_time,
            "posted": tweet.posted
        })

    return jsonify({"scheduled_tweets": scheduled_tweets}), 200