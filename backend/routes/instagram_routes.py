from flask import Blueprint, request, jsonify, redirect
from urllib.parse import urlencode
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv

from mydatabase.models import MetaToken
from mydatabase.database import db  # Adjust import to your actual app structure

load_dotenv()

instagram_bp = Blueprint("instagram", __name__)

FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")

@instagram_bp.route('/save-id', methods=["GET"])
@jwt_required()
def save_instagram_id():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()
    if not token or not token.facebook_page_id or not token.page_access_token:
        return jsonify({'error': 'Page data missing or not connected'}), 400

    url = f'https://graph.facebook.com/v18.0/{token.facebook_page_id}'
    params = {
        'fields': 'instagram_business_account',
        'access_token': token.page_access_token
    }
    res = requests.get(url, params=params).json()
    ig_id = res.get("instagram_business_account", {}).get("id")
    
    
    print("instagram id: ", ig_id)

    if not ig_id:
        return jsonify({"error": "Instagram account not found or not linked"}), 404

    token.insta_page_id = ig_id
    db.session.commit()
    return jsonify({"instagram_page_id": ig_id})







@instagram_bp.route('/info', methods=['GET'])
@jwt_required()
def get_instagram_info():
    """
    Endpoint to fetch detailed Instagram account information (bio, followers, etc.)
    for the logged-in user based on the saved Instagram account ID.
    """
    # Get the current user from JWT
    current_user = get_jwt_identity()

    # Fetch the MetaToken for the current user
    token = MetaToken.query.filter_by(user_id=current_user).first()
    
    if not token or not token.insta_page_id or not token.page_access_token:
        return jsonify({"error": "Instagram account or access token not found."}), 400

    insta_page_id = token.insta_page_id
    page_access_token = token.page_access_token

    # Instagram Graph API URL to get user info (replace with your version)
    instagram_url = f'https://graph.facebook.com/v18.0/{insta_page_id}'
    
    # Define the fields you want to fetch
    fields = 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website'

    # Make the GET request to the Instagram API
    response = requests.get(instagram_url, params={
        'fields': fields,
        'access_token': page_access_token
    })

    # Check if the response is successful
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch Instagram info", "details": response.json()}), 400
    
    # Return the Instagram info from the response
    return jsonify(response.json())




@instagram_bp.route('/post', methods=["POST"])
@jwt_required()
def post_to_instagram():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()

    if not token or not token.insta_page_id or not token.page_access_token:
        return jsonify({"error": "Instagram ID or token missing"}), 400

    data = request.json
    image_url = data.get("image_url")
    caption = data.get("caption", "")

    if not image_url:
        return jsonify({"error": "Image URL is required"}), 400

    # Step 1: Create media object
    media_url = f'https://graph.facebook.com/v18.0/{token.insta_page_id}/media'
    media_payload = {
        'image_url': image_url,
        'caption': caption,
        'access_token': token.page_access_token
    }
    media_response = requests.post(media_url, data=media_payload).json()

    if "error" in media_response:
        return jsonify({"error": "Failed to create Instagram media", "details": media_response}), 400

    creation_id = media_response.get("id")
    if not creation_id:
        return jsonify({"error": "Media ID not returned", "response": media_response}), 400

    # Step 2: Publish media
    publish_url = f'https://graph.facebook.com/v18.0/{token.insta_page_id}/media_publish'
    publish_response = requests.post(publish_url, data={
        'creation_id': creation_id,
        'access_token': token.page_access_token
    })

    publish_data = publish_response.json()
    if "error" in publish_data:
        return jsonify({"error": "Failed to publish Instagram media", "details": publish_data}), 400

    return jsonify({"message": "Successfully posted to Instagram", "response": publish_data})

