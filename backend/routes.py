from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from database import db
from models import User
import secrets
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import check_password_hash
from datetime import timedelta

mail = Mail()
auth_bp = Blueprint("auth", __name__)

# User Registration
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print("Data:", data)    # Debugging
    # Validate required fields
    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Username, email, and password are required."}), 400

    # Check if email already exists
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email is already registered. Please use a different email."}), 400

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(username=data["username"], email=data["email"], password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


# User Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate Access & Refresh Tokens
    access_token = create_access_token(identity=str(user.email), expires_delta=timedelta(days=3))
    refresh_token = create_refresh_token(identity=str(user.email), expires_delta=timedelta(days=7))
    
    access_token= access_token.decode("utf-8")
    refresh_token= refresh_token.decode("utf-8")

    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

# Refresh Token Endpoint
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Requires refresh token
def refresh():
    identity = get_jwt_identity()  # Get user identity from refresh token
    new_access_token = create_access_token(identity=identity, expires_delta=timedelta(days=3))
    
    new_access_token= new_access_token.decode("utf-8")
    return jsonify({"access_token": new_access_token}), 200


# Forgot Password (Send Reset Token)
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    
    if not user:
        return jsonify({"error": "Email not found"}), 404
    
    reset_token = secrets.token_hex(20)
    user.reset_token = reset_token
    db.session.commit()

    # Send reset email
    msg = Message("Password Reset Request", sender="noreply@example.com", recipients=[user.email])
    msg.body = f"Your password reset token is: {reset_token}"
    mail.send(msg)

    return jsonify({"message": "Reset token sent to your email"}), 200

# Reset Password
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    user = User.query.filter_by(reset_token=data["token"]).first()

    if not user:
        return jsonify({"error": "Invalid or expired token"}), 400

    user.password = generate_password_hash(data["new_password"], method="pbkdf2:sha256")
    user.reset_token = None  # Clear reset token
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200

# Update User Details
@auth_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()  # Query by email

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200



@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    
    current_user_email = get_jwt_identity()
    if not current_user_email:
        return jsonify({"error": "Unauthorized - Invalid token"}), 401

    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200
