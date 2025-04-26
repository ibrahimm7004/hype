from dateutil import parser
import pytz
from datetime import datetime

# Function to convert any given date or time string to PKT
def convert_to_pkt(date_string):
    # Define Pakistan timezone
    pakistan_tz = pytz.timezone("Asia/Karachi")
    
    # Check if date_string is already in datetime object format
    if isinstance(date_string, datetime):
        # If it's a datetime object, localize it to Pakistan time
        return date_string.astimezone(pakistan_tz)
    
    # Attempt to parse date_string (handles ISO, natural language, etc.)
    try:
        # Try parsing with dateutil's parser (handles a wide range of date formats)
        parsed_date = parser.isoparse(date_string)
    except ValueError:
        raise ValueError("Invalid date string format")
    
    # Convert the parsed date (in UTC by default) to PKT
    if parsed_date.tzinfo is None:
        # If no timezone is provided, assume it is UTC and localize
        parsed_date = pytz.utc.localize(parsed_date)
    
    # Convert to Pakistan Time Zone
    return parsed_date.astimezone(pakistan_tz)



# utils/scheduled_posts.py

from mydatabase.models import FacebookPostSchedule, InstagramPostSchedule, RedditPostSchedule

def get_facebook_scheduled_posts(user_id):
    if not user_id:
        return {"error": "Missing user_id"}, 400

    posts = FacebookPostSchedule.query.filter_by(user_id=user_id).all()
    scheduled_posts = [{
        "id": post.id,
        "page_id": post.page_id,
        "message": post.message,
        "link": post.link,
        "image_url": post.image_url,
        "scheduled_time": post.scheduled_time,
        "posted": post.posted
    } for post in posts]

    return {"scheduled_posts": scheduled_posts}, 200


def get_instagram_scheduled_posts(user_id):
    if not user_id:
        return {"error": "Missing user_id"}, 400

    posts = InstagramPostSchedule.query.filter_by(user_id=user_id).all()
    scheduled_posts = [{
        "id": post.id,
        "account_id": post.account_id,
        "caption": post.caption,
        "image_url": post.image_url,
        "scheduled_time": post.scheduled_time,
        "posted": post.posted
    } for post in posts]

    return {"scheduled_posts": scheduled_posts}, 200


def get_reddit_scheduled_posts(user_id):
    if not user_id:
        return {"error": "Missing user_id"}, 400

    posts = RedditPostSchedule.query.filter_by(user_id=user_id).all()
    scheduled_posts = [{
        "id": post.id,
        "title": post.title,
        "subreddit": post.subreddit,
        "kind": post.kind,
        "url": post.url,
        "text": post.text,
        "scheduled_time": post.scheduled_time,
        "posted": post.posted
    } for post in posts]

    return {"scheduled_posts": scheduled_posts}, 200

