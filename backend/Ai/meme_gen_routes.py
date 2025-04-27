from flask import send_file, url_for
import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from Ai.M2_meme_gen.meme_generator import generate_meme_from_json
from Ai.M1_meme_text.meme_text_generator import meme_text_generator_function

# Load environment variables
load_dotenv()

meme_gen_bp = Blueprint("meme_gen", __name__)




@meme_gen_bp.route("/generate", methods=["POST"])
def generate_meme():
    print("Generating meme...")


    meme_image_paths=[]
    meme_urls = [url_for('static', filename=f'generated-memes/{os.path.basename(path)}', _external=True) for path in meme_image_paths]

    
    data = request.get_json()
    
    promptText = data.get("promptText")
    promptQna = data.get("promptQna")
    
    if not promptText or not promptQna:
        return jsonify({"error": "Prompt text and QnA are required"}), 400
    
    print("Prompt text:", promptText)
    print("Prompt QnA:", promptQna)
    
    meme_image_paths = generate_meme_from_json(promptText, promptQna)
    

    if not meme_image_paths:
        return jsonify({"error": "Failed to generate memes"}), 500
    
    # Generate accessible URLs for images
    # meme_image_paths = [' /static/generated-memes/Empty-Red-And-Black_meme.jpg','/static/generated-memes/Overly-Suave-IT-Guy_meme.jpg','/static/generated-memes/McMelch_meme.jpg']
    meme_urls = [url_for('static', filename=f'generated-memes/{os.path.basename(path)}', _external=True) for path in meme_image_paths]
    return jsonify({"message": "Memes generated", "image_urls": meme_urls}), 200


@meme_gen_bp.route("/text", methods=["POST"])
def generate_text():
    print("generating text...")
    data = request.get_json()
    
    
    
    
    
    expected_data =['location', 'trendy_language' ,'trendy_humour', 'type_post', 'prompt']
    
    for key in expected_data:
        if key not in data:
            return jsonify({"error": f"Missing required data: {key}"}), 400
    
    
    
    # Generate text
    text = meme_text_generator_function(data)
    
    print(text)
    
    return jsonify({"message": "Text generated","results":text}), 200