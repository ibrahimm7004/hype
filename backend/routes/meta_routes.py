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

meta_bp = Blueprint("meta", __name__)

FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")

# ─────────────────────────────────────────────────────────────
# STEP 1: Facebook Login URL
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/facebook/login', methods=["POST"])
@jwt_required()
def facebook_login():
    current_user = get_jwt_identity()
    print("current user: ",current_user)
    fb_auth_url = 'https://www.facebook.com/v22.0/dialog/oauth'
    params = {
        'client_id': FACEBOOK_APP_ID,
        'redirect_uri': FACEBOOK_REDIRECT_URI,
        'state': current_user,
        'scope': (
            'email,pages_manage_cta,pages_manage_instant_articles,pages_show_list,'
            'read_page_mailboxes,ads_management,business_management,pages_messaging,'
            'pages_read_engagement,pages_manage_metadata,pages_manage_posts,'
            'pages_manage_ads,instagram_basic,instagram_content_publish'
        )
    }
    return jsonify({'auth_url': f"{fb_auth_url}?{urlencode(params)}"})

# ─────────────────────────────────────────────────────────────
# STEP 2: Facebook Callback - Save Tokens
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/facebook/callback')
def facebook_callback():
    print("debug")
    code = request.args.get('code')
    user_id = request.args.get('state')

    # Get short-lived token
    token_url = 'https://graph.facebook.com/v13.0/oauth/access_token'
    params = {
        'client_id': FACEBOOK_APP_ID,
        'redirect_uri': FACEBOOK_REDIRECT_URI,
        'client_secret': FACEBOOK_APP_SECRET,
        'code': code
    }
    response = requests.get(token_url, params=params).json()
    short_token = response.get('access_token')

    if not short_token:
        return jsonify({'error': 'Failed to retrieve access token'}), 400

    # Exchange for long-lived token
    exchange_url = 'https://graph.facebook.com/v13.0/oauth/access_token'
    exchange_params = {
        'grant_type': 'fb_exchange_token',
        'client_id': FACEBOOK_APP_ID,
        'client_secret': FACEBOOK_APP_SECRET,
        'fb_exchange_token': short_token
    }
    exchange_data = requests.get(exchange_url, params=exchange_params).json()
    long_token = exchange_data.get('access_token')
    expires_at = datetime.utcnow() + timedelta(seconds=exchange_data.get('expires_in', 0))

    # Save to DB
    token = MetaToken.query.filter_by(user_id=user_id).first()
    if not token:
        token = MetaToken(user_id=user_id)

    token.access_token = short_token
    token.long_lived_token = long_token
    token.token_expires_at = expires_at
    db.session.add(token)
    db.session.commit()

    return jsonify({'message': 'Facebook token saved successfully'}),200

# ─────────────────────────────────────────────────────────────
# STEP 3: Get Facebook Pages List
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/facebook/get-user-pages', methods=["GET"])
@jwt_required()
def get_pages():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()
    if not token:
        return jsonify({'error': 'No token found'}), 404

    url = 'https://graph.facebook.com/v19.0/me/accounts'
    res = requests.get(url, params={'access_token': token.long_lived_token}).json()
    return jsonify(res)

# ─────────────────────────────────────────────────────────────
# STEP 4: Save Selected Page ID
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/facebook/save-page', methods=["POST"])
@jwt_required()
def save_selected_page():
    current_user = get_jwt_identity()
    page_id = request.json.get("page_id")
    page_token = request.json.get("page_access_token")

    if not page_id or not page_token:
        return jsonify({"error": "page_id and page_access_token required"}), 400

    token = MetaToken.query.filter_by(user_id=current_user).first()
    if not token:
        return jsonify({"error": "No token found"}), 404

    token.facebook_page_id = page_id
    token.page_access_token = page_token
    db.session.commit()

    return jsonify({"message": "Page info saved successfully"})

# ─────────────────────────────────────────────────────────────
# STEP 5: Get Instagram Business Account ID
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/instagram/save-id', methods=["GET"])
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
    
    
    print("insta id: ", ig_id)

    if not ig_id:
        return jsonify({"error": "Instagram account not found or not linked"}), 404

    token.insta_page_id = ig_id
    db.session.commit()
    return jsonify({"instagram_page_id": ig_id})




# ─────────────────────────────────────────────────────────────
# GET CONNECTED INSTAGRAM BUSINESS ACCOUNT
# ─────────────────────────────────────────────────────────────
@meta_bp.route('/facebook/connected-instagram', methods=["GET"])
@jwt_required()
def get_connected_instagram():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()

    if not token or not token.facebook_page_id or not token.page_access_token:
        return jsonify({"error": "Page ID or access token missing"}), 400

    # Facebook Graph API endpoint to get connected Instagram account
    url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}"
    params = {
        "fields": "connected_instagram_account",
        "access_token": token.page_access_token
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "error" in data:
        return jsonify({"error": "Failed to retrieve Instagram account", "details": data}), 400

    instagram_account = data.get("connected_instagram_account")

    if not instagram_account:
        return jsonify({"error": "No Instagram account connected"}), 404

    return jsonify(instagram_account)


@meta_bp.route('/instagram/info', methods=['GET'])
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


@meta_bp.route('/facebook/post', methods=["POST"])
@jwt_required()
def post_to_facebook():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()

    if not token or not token.facebook_page_id or not token.page_access_token:
        return jsonify({"error": "Facebook page ID or token missing"}), 400
    # print(request.form)
    
    # return jsonify({"message":"successful"}),200
    data = request.form
    
    print(data)
    message = data.get("post_text")
    link = data.get("link")
    image_url = data.get("image_url")

    if not message and not link and not image_url:
        return jsonify({"error": "At least one of 'message', 'link', or 'image_url' must be provided"}), 400

    post_url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}/feed"
    post_data = {
        "access_token": token.page_access_token,
        "message": message
    }

    if link:
        post_data["link"] = link
    if image_url:
        # Use photo endpoint if an image is provided
        photo_url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}/photos"
        photo_data = {
            "url": image_url,
            "caption": message,
            "access_token": token.page_access_token
        }
        response = requests.post(photo_url, data=photo_data)
    else:
        # Default to feed endpoint
        response = requests.post(post_url, data=post_data)

    if response.status_code != 200:
        return jsonify({"error": "Failed to post to Facebook", "details": response.json()}), 400

    return jsonify({"message": "Successfully posted to Facebook", "response": response.json()})



@meta_bp.route('/instagram/post', methods=["POST"])
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



@meta_bp.route('/facebook/page/info', methods=['GET'])
@jwt_required()
def get_facebook_page_info():
    """
    Fetch detailed Facebook Page info for the currently connected page.
    """
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()

    if not token or not token.facebook_page_id or not token.page_access_token:
        return jsonify({"error": "Missing Facebook page or access token"}), 400

    page_id = token.facebook_page_id
    access_token = token.page_access_token

    # Define the Graph API endpoint and fields to fetch
    url = f"https://graph.facebook.com/v18.0/{page_id}"
    fields = (
        "id,name,username,about,link,category,category_list,"
        "fan_count,followers_count,website,location,emails,"
        "phone,whatsapp_number,description,cover,picture.type(large)"
    )

    response = requests.get(url, params={
        "fields": fields,
        "access_token": access_token
    })

    if response.status_code != 200:
        return jsonify({
            "error": "Failed to fetch Facebook page details",
            "details": response.json()
        }), 400

    return jsonify(response.json())
