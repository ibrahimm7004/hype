from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask import jsonify
from mydatabase.config import Config
from mydatabase.database import db
from routes.user_routes import auth_bp, mail
from flask_cors import CORS
from routes.twitter_auth import twitter_bp  # Import the blueprint
from routes.cloudinary_routes import cloudinary_bp  # Import the blueprint
from routes.reddit_routes import reddit_bp  # Import the blueprint
from datetime import timedelta
from Ai.meme_gen_routes import meme_gen_bp  # Import the blueprint
from flask_session import Session
import os 

app = Flask(__name__)

# 🌍 Enable CORS with credentials
CORS(app, supports_credentials=True)

app.config.from_object(Config)

# Initialize Extensions
db.init_app(app)



app.config["SESSION_REFRESH_EACH_REQUEST"] = os.getenv("SESSION_REFRESH_EACH_REQUEST")


app.config["SESSION_TYPE"] = os.getenv("SESSION_TYPE")
app.config["SESSION_PERMANENT"] = os.getenv("SESSION_PERMANENT")
Session(app)


# 🔐 Configure JWT Token Expiry Time
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES")))  
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES")))   


jwt = JWTManager(app)
mail.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(twitter_bp, url_prefix="/api/twitter")  # Twitter OAuth routes
app.register_blueprint(reddit_bp, url_prefix="/api/reddit")  # reddit routes
app.register_blueprint(cloudinary_bp, url_prefix="/api/cloudinary")  # Cloudinary routes
app.register_blueprint(meme_gen_bp, url_prefix="/api/ai/meme-gen")  # meme_gen routes

# Create Tables
with app.app_context():
    db.create_all()

#test route 
@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello World! 🌍','app': 'Meme Generator API','port': '8000'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)  # ✅ Correct

