
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from mydatabase.database import db
from mydatabase.models import  ScheduledTweet, UserToken  
from flask import jsonify
from requests_oauthlib import OAuth1
from flask import Blueprint, request, jsonify, redirect, session, url_for
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,get_jwt
)
import requests
import os
from urllib.parse import urlparse

from werkzeug.utils import secure_filename

import pytz

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
POST_TWEET_URL = "https://api.twitter.com/2/tweets"
UPLOAD_MEDIA_URL = 'https://upload.twitter.com/1.1/media/upload.json'



scheduler = BackgroundScheduler()


def check_and_post_tweets():
    from app import app # Import your Flask app
    with app.app_context():  # Ensure the function runs inside an application context
        now_utc = datetime.utcnow()
        # Convert to Pakistan Time (PKT)
        pkt_timezone = pytz.timezone("Asia/Karachi")
        now_pkt = now_utc.replace(tzinfo=pytz.utc).astimezone(pkt_timezone)
        print(f"checking for tweets to post at {now_pkt}")
        pending_tweets = ScheduledTweet.query.filter(
            ScheduledTweet.scheduled_time <= now_pkt, ScheduledTweet.posted == False
        ).all()
        
        print(f"Found {len(pending_tweets)} tweets to post")
        
        for tweet in pending_tweets:
            
            print(f"Posting tweet: {tweet.tweet_text}")
            
            auth = get_twitter_auth_from_user_id(tweet.user_id)

            if not auth:
                print(f"User {tweet.user_id} has no Twitter auth")
                continue
            
            access_token = auth["access_token"]
            access_token_secret = auth["access_token_secret"]
            response, status_code = post_tweet( tweet.tweet_text, tweet.image_url, access_token , access_token_secret)
            # print(response)
            if status_code == 200:
                print(f"Tweet posted successfully: {response}")
                tweet.posted = True
                db.session.commit()
            else:
                print(f"Failed to post tweet: {response}")
            


# # Run every minute
# scheduler.add_job(check_and_post_tweets, "interval", minutes=1)
# scheduler.start()






def post_tweet(tweet_text, image_file, access_token, access_token_secret):
    
    # return jsonify({"message": "Tweet posted successfully!"}), 200
    """Handles posting a tweet with an optional image (file or URL)."""

    oauth = OAuth1(
        CLIENT_ID, CLIENT_SECRET,
        access_token, access_token_secret
    )

    media_id = None
    image_path = None

    # Check if image_file is a URL or a file
    if image_file:
        if isinstance(image_file, str) and (image_file.startswith("http://") or image_file.startswith("https://")):
            print("Image file is a URL\n")

            # Download image from URL
            response = requests.get(image_file, stream=True)
            if response.status_code == 200:
                parsed_url = urlparse(image_file)
                filename = os.path.basename(parsed_url.path)
                image_path = f"/tmp/{secure_filename(filename)}"

                with open(image_path, 'wb') as img_file:
                    for chunk in response.iter_content(1024):
                        img_file.write(chunk)

                print(f"Downloaded image from URL: {image_path}")
            else:
                return jsonify({"error": "Failed to download image from URL."}), 400

        else:
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

        # Remove temporary file
        if image_path:
            os.remove(image_path)

    else:
        print("No media file is present\n")

    # Create payload for posting the tweet
    payload = {"text": tweet_text}
    if media_id:
        payload["media"] = {"media_ids": [media_id]}  # Attach media_id if available

    print("Payload:", payload)

    # Post the tweet
    headers = {"Content-Type": "application/json"}
    response = requests.post(POST_TWEET_URL, auth=oauth, json=payload, headers=headers)

    # Check if tweet was successfully posted
    if response.status_code == 201:
        return jsonify({"message": "Tweet posted successfully!"}), 200

    return jsonify({"error": response.text}), 400



def get_twitter_auth_from_user_id(user_id):
    """Get Twitter OAuth tokens from user ID"""
    user_token = UserToken.query.filter_by(user_id=user_id).first()

    if not user_token:
        return None

    return{
        "access_token": user_token.oauth_token, 
        "access_token_secret": user_token.oauth_token_secret
    }