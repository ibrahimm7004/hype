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

# Create a Flask Blueprint for Cloudinary routes
cloudinary_bp = Blueprint("cloudinary", __name__)

### UPLOAD IMAGE ###
@cloudinary_bp.route("/upload", methods=["POST"])
def upload_image():
    try:
    
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        upload_result = cloudinary.uploader.upload(file)

        return jsonify({"message": "Upload successful", "data": upload_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


### GET IMAGE DETAILS ###
@cloudinary_bp.route("/image/<public_id>", methods=["GET"])
def get_image(public_id):
    try:
        image_info = cloudinary.api.resource(public_id)
        return jsonify({"message": "Image found", "data": image_info}), 200
    except cloudinary.exceptions.NotFound:
        return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


### UPDATE IMAGE (RE-UPLOAD) ###
@cloudinary_bp.route("/update/<public_id>", methods=["PUT"])
def update_image(public_id):
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Delete the old image first
        cloudinary.uploader.destroy(public_id)

        # Upload new image
        upload_result = cloudinary.uploader.upload(file)

        return jsonify({"message": "Image updated successfully", "data": upload_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


### DELETE IMAGE ###
@cloudinary_bp.route("/delete/<public_id>", methods=["DELETE"])
def delete_image(public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result["result"] == "not found":
            return jsonify({"error": "Image not found"}), 404

        return jsonify({"message": "Image deleted successfully", "data": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
