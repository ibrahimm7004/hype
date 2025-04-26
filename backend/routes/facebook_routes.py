from flask import Blueprint, request, jsonify, redirect
from urllib.parse import urlencode
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
from utils import convert_to_pkt, get_facebook_scheduled_posts
from mydatabase.models import MetaToken
from mydatabase.database import db  # Adjust import to your actual app structure

load_dotenv()

facebook_bp = Blueprint("facebook", __name__)

FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")

# ─────────────────────────────────────────────────────────────
# STEP 1: Facebook Login URL
# ─────────────────────────────────────────────────────────────
@facebook_bp.route('/login', methods=["POST"])
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
@facebook_bp.route('/callback')
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
@facebook_bp.route('/get-user-pages', methods=["GET"])
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
@facebook_bp.route('/save-page', methods=["POST"])
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
# GET CONNECTED INSTAGRAM BUSINESS ACCOUNT
# ─────────────────────────────────────────────────────────────
@facebook_bp.route('/connected-instagram', methods=["GET"])
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


from mydatabase.models import FacebookPostSchedule
from routes.cloudinary_routes import cloudinary_upload


@facebook_bp.route('/post', methods=["POST"])
@jwt_required()
def create_or_schedule_facebook_post():
    current_user = get_jwt_identity()
    token = MetaToken.query.filter_by(user_id=current_user).first()

    if not token or not token.facebook_page_id or not token.page_access_token:
        return jsonify({"error": "Facebook page ID or token missing"}), 400

    data = request.form
    file = request.files.get("image_file")

    message = data.get("post_text")
    link = data.get("link")
    image_url = data.get("image_url")
    post_type = data.get("post_type", "instant")  # "instant" or "scheduled"
    scheduled_time = data.get("scheduled_time")

    if not message and not link and not image_url and not file:
        return jsonify({
            "error": "At least one of 'message', 'link', 'image_url', or 'image_file' must be provided"
        }), 400

    if post_type == "scheduled":
        # Upload to Cloudinary if image file is provided
        if file:
            try:
                upload_result = cloudinary_upload(file)
                image_url = upload_result["secure_url"]
            except Exception as e:
                return jsonify({"error": "Cloudinary upload failed", "details": str(e)}), 500

        if not scheduled_time:
            return jsonify({"error": "Scheduled time is required for scheduled posts"}), 400
        
        pkt_time = convert_to_pkt(scheduled_time)
        print(scheduled_time)
        print(link)

        scheduled_post = FacebookPostSchedule(
            user_id=current_user,
            page_id=token.facebook_page_id,
            message=message,
            link=link,
            image_url=image_url,
            scheduled_time=pkt_time,
            posted=False
        )
        db.session.add(scheduled_post)
        db.session.commit()

        return jsonify({"message": "Post scheduled successfully"})

    else:  # post_type == "instant"
        # If file provided, use Facebook upload directly
        if file:
            photo_url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}/photos"
            files = {
                "source": (file.filename, file.stream, file.content_type)
            }
            photo_data = {
                "caption": message,
                "access_token": token.page_access_token
            }
            response = requests.post(photo_url, data=photo_data, files=files)

        elif image_url:
            photo_url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}/photos"
            photo_data = {
                "url": image_url,
                "caption": message,
                "access_token": token.page_access_token
            }
            response = requests.post(photo_url, data=photo_data)

        else:
            post_url = f"https://graph.facebook.com/v18.0/{token.facebook_page_id}/feed"
            post_data = {
                "access_token": token.page_access_token,
                "message": message
            }
            if link:
                post_data["link"] = link
            response = requests.post(post_url, data=post_data)

        if response.status_code != 200:
            return jsonify({
                "error": "Failed to post to Facebook",
                "details": response.json()
            }), 400

        return jsonify({
            "message": "Successfully posted to Facebook",
            "response": response.json()
        })




@facebook_bp.route('/page/info', methods=['GET'])
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




@facebook_bp.route("/scheduled-facebook-posts", methods=["GET"])
@jwt_required()
def scheduled_facebook_posts():
    user_id = get_jwt_identity()
    data, status = get_facebook_scheduled_posts(user_id)
    return jsonify(data), status