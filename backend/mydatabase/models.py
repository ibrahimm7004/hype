from mydatabase.database import db
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

def generate_secure_user_id():
    """Generate a unique user ID using UUID"""
    return str(uuid.uuid4())[:16]  # Shortened UUID

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(16), unique=True, nullable=False, default=generate_secure_user_id, index=True)
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)  # Already hashed elsewhere
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ScheduledTweet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(16), db.ForeignKey('user.user_id', ondelete="CASCADE"), nullable=False, index=True)
    tweet_text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)  # Cloudinary image URL
    scheduled_time = db.Column(db.DateTime, nullable=False)  # When to post
    posted = db.Column(db.Boolean, default=False)  # Track if it's posted

    def __repr__(self):
        return f"<ScheduledTweet {self.id} - {self.scheduled_time}>"

class UserToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(16), db.ForeignKey('user.user_id', ondelete="CASCADE"), nullable=False, index=True)
    twitter_user_id = db.Column(db.String(50), nullable=False, unique=True)  # Twitter user ID
    screen_name = db.Column(db.String(50), nullable=False)  # Twitter username
    oauth_token = db.Column(db.String(255), nullable=False)  # Access token
    oauth_token_secret = db.Column(db.String(255), nullable=False)  # Access token secret
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)



class RedditUserToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(16), db.ForeignKey('user.user_id', ondelete="CASCADE"), nullable=False, index=True)
    reddit_user_id = db.Column(db.String(50), nullable=False, unique=True)  # Reddit user ID
    username = db.Column(db.String(50), nullable=False)  # Reddit username
    access_token = db.Column(db.Text, nullable=False)  # OAuth access token
    refresh_token = db.Column(db.Text, nullable=False)  # OAuth refresh token
    token_expires_at = db.Column(db.DateTime, nullable=False)  # Token expiration time
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True, onupdate=datetime.utcnow)

    def is_token_expired(self):
        """Check if the access token has expired."""
        return datetime.utcnow() >= self.token_expires_at
    
    
    
    
