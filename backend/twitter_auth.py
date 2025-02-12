from flask import Blueprint, request, jsonify, redirect, session, url_for
import requests
from requests_oauthlib import OAuth1
from flask_cors import CORS, cross_origin
import jwt
import datetime
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
import os
twitter_bp = Blueprint("twitter", __name__)  # Define the blueprint
# Load environment variables
load_dotenv()
# # Twitter API credentials
CLIENT_ID = "YLZjvwSgyaw42v0JDRS58YqLA"
CLIENT_SECRET = "5Cux0uHbZlsk1AaQQa1hyynTJm04EmSzmczz1bWtsXfnRLdqra"

TWITTER_JWT_SECRET = "twitter_secret_key"
JWT_EXPIRATION = 36000  # 1 hour
JWT_ALGORITHM = "HS256"

# CLIENT_ID = os.getenv("CLIENT_ID")
# CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# TWITTER_JWT_SECRET = os.getenv("TWITTER_JWT_SECRET")
# JWT_EXPIRATION = os.getenv("JWT_EXPIRATION")
# JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
# Twitter API endpoints
REQUEST_TOKEN_URL = "https://api.twitter.com/oauth/request_token"
AUTHENTICATE_URL = "https://api.twitter.com/oauth/authenticate"
ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token"
USER_INFO_URL = "https://api.twitter.com/1.1/account/verify_credentials.json"
POST_TWEET_URL = "https://api.twitter.com/2/tweets"
UPLOAD_MEDIA_URL = 'https://upload.twitter.com/1.1/media/upload.json'






@twitter_bp.route("/login", methods=["GET"])
@cross_origin(supports_credentials=True)
def twitter_login():
    """Get Twitter OAuth token & return JWT"""
    oauth = OAuth1(CLIENT_ID, CLIENT_SECRET)
    response = requests.post(REQUEST_TOKEN_URL, auth=oauth)

    if response.status_code != 200:
        return jsonify({"error": "Error fetching request token"}), 400

    credentials = dict(x.split("=") for x in response.text.split("&"))

    # Create JWT for Twitter OAuth tokens
    twitter_payload = {
        "oauth_token": credentials.get("oauth_token"),
        "oauth_token_secret": credentials.get("oauth_token_secret"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
    }
    
    

    twitter_jwt = jwt.encode(twitter_payload, TWITTER_JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    print("\nTwitter JWT login:", twitter_jwt)

    auth_url = f"{AUTHENTICATE_URL}?oauth_token={credentials.get('oauth_token')}"
    
    return jsonify({"auth_url": auth_url, "twitter_token": twitter_jwt, "oauth_token":credentials.get("oauth_token")}),200


@twitter_bp.route("/callback", methods=["GET"])
# @jwt_required()
def callback():
    """ Step 2: Exchange verifier for Access Token using JWT """
    oauth_token = request.args.get("oauth_token")
    oauth_verifier = request.args.get("oauth_verifier")
    auth_header = request.headers.get("Authorization")
    # return jsonify({"message": "Callback received successfully!"}), 200
    

    if not oauth_token or not oauth_verifier or not auth_header:
        return jsonify({"error": "Missing credentials"}), 400
    
    print("auth_header:", auth_header)
    jwt_token = auth_header.split(" ")[1]  # ✅ Extract actual token
    print("jwt_token:", jwt_token)

    # Decode JWT to get stored OAuth tokens
    try:
        decoded_token = jwt.decode(jwt_token, TWITTER_JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired. Please login again."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401



    # Verify OAuth token matches the one in JWT
    if decoded_token["oauth_token"] != oauth_token:
        return jsonify({"error": "OAuth token mismatch."}), 400

    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        decoded_token["oauth_token"], decoded_token["oauth_token_secret"],
        verifier=oauth_verifier
    )

    response = requests.post(ACCESS_TOKEN_URL, auth=oauth)

    if response.status_code != 200:
        return jsonify({"error": "Error fetching access token"}), 400

    credentials = dict(x.split("=") for x in response.text.split("&"))

    # ✅ Generate new JWT with full access tokens
    payload = {
        "access_token": credentials["oauth_token"],
        "access_token_secret": credentials["oauth_token_secret"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),  # 24-hour validity
    }

    jwt_token = jwt.encode(payload, TWITTER_JWT_SECRET, algorithm=JWT_ALGORITHM)

    return jsonify({"message": "Access token received successfully!", "twitter_token": jwt_token})

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

    # Decode JWT to get stored OAuth tokens
    try:
        decoded_token = jwt.decode(jwt_token, TWITTER_JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired. Please login again."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

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
def tweet():
    """Post a tweet with an optional image"""
    oauth_token = request.args.get("oauth_token")
    auth_header = request.headers.get("Authorization")
    
    tweet_text = request.form.get("tweet_text")
    image_file = request.files.get("image")  # Get the image file from the form
    
    if not oauth_token or not auth_header:
        return jsonify({"error": "Missing credentials"}), 400
    
    # Extract and decode the JWT token to get OAuth tokens
    jwt_token = auth_header.split(" ")[1]  # Extract JWT from authorization header
    try:
        decoded_token = jwt.decode(jwt_token, TWITTER_JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired. Please login again."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    # OAuth1 for Twitter API authentication
    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        decoded_token["access_token"], decoded_token["access_token_secret"]
    )
    
    print("decoded_token:", decoded_token)

    # Check if an image was uploaded
    media_id = None
    if image_file:
        print("Media file is present\n")
        # Secure and save the image temporarily
        filename = secure_filename(image_file.filename)
        image_path = f"/tmp/{filename}"
        image_file.save(image_path)
        
        # Upload image to Twitter Media Upload endpoint
        with open(image_path, 'rb') as image:
            media_data = {'media': image}
            media_response = requests.post(UPLOAD_MEDIA_URL, auth=oauth, files=media_data)
            
            if media_response.status_code == 200:
                media_id = media_response.json().get("media_id_string")
                print("Media Upload Successful (Media ID):", media_id)    
            else:
                return jsonify({"error": "Failed to upload image."}), 400
    else:
        print("No media file is present\n")
        
        
    # Create payload for posting the tweet
    payload = {"text": tweet_text}
    print("request", request.data)
    print("fomr data:", dict(request.form))
    # return jsonify({"message": "Tweet posted successfully!"}),200
    if media_id:
        payload["media"]= {"media_ids": [media_id]}  # Attach media_id if available
    
    print("Payload:", payload)
    # Post the tweet
    headers = {"Content-Type": "application/json"}
    response = requests.post(POST_TWEET_URL, auth=oauth, json=payload, headers=headers)

    # Check if tweet was successfully posted
    if response.status_code == 201:
        return jsonify({"message": "Tweet posted successfully!"})

    return jsonify({"error": response.text}), 400




# TWITTER_API_URL = "https://api.twitter.com/2/tweets"

# # WOEID for Pakistan (Where On Earth IDentifier)

# @twitter_bp.route("/analytics", methods=["GET"])
# def get_pakistan_trends():
    """ Fetch trending topics in Pakistan """

    oauth_token = request.args.get("oauth_token")
    auth_header = request.headers.get("Authorization")

    if not oauth_token or not auth_header:
        return jsonify({"error": "Missing credentials"}), 400

    # Extract JWT token from Authorization header
    try:
        jwt_token = auth_header.split(" ")[1]
        decoded_token = jwt.decode(jwt_token, TWITTER_JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired. Please login again."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    # Authenticate with Twitter using OAuth1
    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        decoded_token["access_token"], decoded_token["access_token_secret"]
    )

    # Fetch trending topics for Pakistan

    
    # Set the Bearer Token for authentication
    bearer_token = 'AAAAAAAAAAAAAAAAAAAAAFDLygEAAAAAIHOkNljccBz5GkPYxWg1PzbbFoY%3DVLbgu4JYXhpIirqVdrjx8YoQNcFCR85C65trfZm9ClNxaj5U6V'

    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json"
    }

    # Step 1: Fetch the user ID
    user_response = requests.get("https://api.twitter.com/2/users/me", headers=headers)

    if user_response.status_code == 200:
        user_data = user_response.json()
        user_id = user_data["data"]["id"]
        print(f"User ID: {user_id}")

        # Step 2: Use the user ID to fetch the user's tweets
        tweets_response = requests.get(f"https://api.twitter.com/2/users/{user_id}/tweets", headers=headers)

        if tweets_response.status_code == 200:
            tweets_data = tweets_response.json()
            print("Tweets:", tweets_data)
        else:
            print(f"Error fetching tweets: {tweets_response.status_code} - {tweets_response.text}")
    else:
        print(f"Error fetching user data: {user_response.status_code} - {user_response.text}")

    
    # print("response:", response.data)
    # print("response:", response)

    if user_response.status_code != 200:
        print("Error fetching tweets:", user_response.text)
        return jsonify({"error": f"Failed to fetch tweets: {user_response.text}"}), 400

    trends_data = user_response.json()

    # Extracting relevant trend information
    trends = []
    if trends_data and isinstance(trends_data, list) and "trends" in trends_data[0]:
        for trend in trends_data[0]["trends"]:
            trends.append({
                "name": trend["name"],
                "url": trend["url"],
                "tweet_volume": trend.get("tweet_volume", "N/A")  # Some trends don't have tweet volume
            })

    return jsonify({"trends": trends})