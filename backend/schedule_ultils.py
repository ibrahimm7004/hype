

from datetime import datetime
from mydatabase.database import db
from mydatabase.models import  ScheduledTweet
from flask import jsonify
from flask import Blueprint, request, jsonify, redirect, session, url_for
from requests_oauthlib import OAuth1
from urllib.parse import urlparse
import requests
import os

import pytz

from mydatabase.models import db, RedditPostSchedule, InstagramPostSchedule, FacebookPostSchedule,ScheduledTweet,RedditUserToken,MetaToken,UserToken
from services.twitter_util import secure_filename
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
POST_TWEET_URL = "https://api.twitter.com/2/tweets"
UPLOAD_MEDIA_URL = 'https://upload.twitter.com/1.1/media/upload.json'



def check_all_scheduled_posts():
    from app import app  # Import your Flask app
    with app.app_context():
        now_utc = datetime.utcnow()
        pkt_timezone = pytz.timezone("Asia/Karachi")
        now_pkt = now_utc.replace(tzinfo=pytz.utc).astimezone(pkt_timezone)

        print(f"Checking for scheduled posts at {now_pkt}")

        # Twitter scheduled posts
        twitter_posts = ScheduledTweet.query.filter(
            ScheduledTweet.scheduled_time <= now_pkt, ScheduledTweet.posted == False
        ).all()

        twitter_data = [{
            "id": tweet.id,
            "user_id": tweet.user_id,
            "tweet_text": tweet.tweet_text,
            "image_url": tweet.image_url,
            "scheduled_time": tweet.scheduled_time.isoformat(),
            "posted": tweet.posted
        } for tweet in twitter_posts]

        # Facebook scheduled posts
        facebook_posts = FacebookPostSchedule.query.filter(
            FacebookPostSchedule.scheduled_time <= now_pkt, FacebookPostSchedule.posted == False
        ).all()

        facebook_data = [{
            "id": fb.id,
            "user_id": fb.user_id,
            "page_id": fb.page_id,
            "message": fb.message,
            "link": fb.link,
            "image_url": fb.image_url,
            "scheduled_time": fb.scheduled_time.isoformat(),
            "posted": fb.posted
        } for fb in facebook_posts]

        # Instagram scheduled posts
        instagram_posts = InstagramPostSchedule.query.filter(
            InstagramPostSchedule.scheduled_time <= now_pkt, InstagramPostSchedule.posted == False
        ).all()

        instagram_data = [{
            "id": insta.id,
            "user_id": insta.user_id,
            "account_id": insta.account_id,
            "caption": insta.caption,
            "image_url": insta.image_url,
            "scheduled_time": insta.scheduled_time.isoformat(),
            "posted": insta.posted
        } for insta in instagram_posts]

        # Reddit scheduled posts
        reddit_posts = RedditPostSchedule.query.filter(
            RedditPostSchedule.scheduled_time <= now_pkt, RedditPostSchedule.posted == False
        ).all()

        reddit_data = [{
            "id": reddit.id,
            "user_id": reddit.user_id,
            "title": reddit.title,
            "subreddit": reddit.subreddit,
            "kind": reddit.kind,
            "url": reddit.url,
            "text": reddit.text,
            "scheduled_time": reddit.scheduled_time.isoformat(),
            "posted": reddit.posted
        } for reddit in reddit_posts]

        structured_data = {
            "twitter": twitter_data,
            "facebook": facebook_data,
            "instagram": instagram_data,
            "reddit": reddit_data,
        }

        return structured_data


def post_to_facebook(post):
    """Post immediately to Facebook using post data"""

    user_id = post['user_id']
    message = post.get('message')
    link = post.get('link')
    image_url = post.get('image_url')
    page_id = post.get('page_id')

    # Fetch the token
    token_obj = MetaToken.query.filter_by(user_id=user_id).first()
    if not token_obj or not token_obj.page_access_token:
        print(f"Error: Facebook token not found for user {user_id}")
        return None

    access_token = token_obj.page_access_token

    try:
        if image_url:
            photo_url = f"https://graph.facebook.com/v18.0/{page_id}/photos"
            photo_data = {
                "url": image_url,
                "caption": message,
                "access_token": access_token
            }
            response = requests.post(photo_url, data=photo_data)
        else:
            post_url = f"https://graph.facebook.com/v18.0/{page_id}/feed"
            post_data = {
                "message": message,
                "access_token": access_token
            }
            if link:
                post_data["link"] = link
            response = requests.post(post_url, data=post_data)

        if response.status_code != 200:
            print(f"Facebook post failed: {response.status_code}, {response.text}")
            return None

        print("Successfully posted to Facebook:", response.json())

        # Update the database to mark this post as posted
        post_id = post['id']  # Assuming the post has an 'id' field to reference it in the database
        facebook_post = FacebookPostSchedule.query.filter_by(id=post_id).first()

        if facebook_post:
            facebook_post.posted = True
            db.session.commit()  # Commit the change to the database
            print(f"Post with ID {post_id} marked as posted.")
        else:
            print(f"Post with ID {post_id} not found in the database.")

        return response.json()

    except Exception as e:
        print(f"Exception while posting to Facebook: {str(e)}")
        return None




def post_to_reddit(post):
    """Post immediately to Reddit using post data"""

    user_id = post['user_id']
    image_url = post.get('url')
    subreddit = post.get('subreddit')
    title = post.get('title')
    kind = post.get('kind')
    text = post.get('text')

    # Fetch the token
    token_obj = RedditUserToken.query.filter_by(user_id=user_id).first()
    if not token_obj:
        print(f"Error: Reddit token not found for user {user_id}")
        return None

    access_token = token_obj.access_token

    try:
        post_data = {
            "title": title,
            "sr": subreddit,
            "kind": kind,
            "url": image_url if kind == "link" else None,
            "text": text if kind == "self" else None,
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "User-Agent": REDDIT_USER_AGENT,
        }

        response = requests.post("https://oauth.reddit.com/api/submit", headers=headers, data=post_data)

        if response.status_code != 200:
            print(f"Reddit post failed: {response.status_code}, {response.text}")
            return None

        print("Successfully posted to Reddit:", response.json())

        # Update the database to mark this post as posted
        post_id = post['id']  # Assuming the post has an 'id' field to reference it in the database
        reddit_post = RedditPostSchedule.query.filter_by(id=post_id).first()

        if reddit_post:
            reddit_post.posted = True
            db.session.commit()  # Commit the change to the database
            print(f"Reddit post with ID {post_id} marked as posted.")
        else:
            print(f"Reddit post with ID {post_id} not found in the database.")

        return response.json()

    except Exception as e:
        print(f"Exception while posting to Reddit: {str(e)}")
        return None

def post_to_instagram(post):
    """Post immediately to Instagram using post data"""

    user_id = post['user_id']
    caption = post.get('caption', '')
    image_url = post.get('image_url')
    account_id = post.get('account_id')

    # Fetch the token
    token_obj = MetaToken.query.filter_by(user_id=user_id).first()
    if not token_obj or not token_obj.page_access_token:
        print(f"Error: Instagram token not found for user {user_id}")
        return None

    access_token = token_obj.page_access_token

    try:
        # Step 1: Create media object
        media_url = f"https://graph.facebook.com/v18.0/{account_id}/media"
        media_payload = {
            'image_url': image_url,
            'caption': caption,
            'access_token': access_token
        }
        media_response = requests.post(media_url, data=media_payload).json()

        if "error" in media_response:
            print(f"Error creating Instagram media: {media_response}")
            return None

        creation_id = media_response.get("id")
        if not creation_id:
            print(f"Failed to get creation_id from Instagram media response: {media_response}")
            return None

        # Step 2: Publish media
        publish_url = f"https://graph.facebook.com/v18.0/{account_id}/media_publish"
        publish_response = requests.post(publish_url, data={
            'creation_id': creation_id,
            'access_token': access_token
        }).json()

        if "error" in publish_response:
            print(f"Error publishing Instagram media: {publish_response}")
            return None

        print("Successfully posted to Instagram:", publish_response)

        # Update the database to mark the Instagram post as posted
        post_id = post['id']  # Assuming the scheduled post has an 'id' field
        instagram_post = InstagramPostSchedule.query.filter_by(id=post_id).first()

        if instagram_post:
            instagram_post.posted = True
            db.session.commit()
            print(f"Instagram post with ID {post_id} marked as posted.")
        else:
            print(f"Instagram post with ID {post_id} not found in the database.")

        return publish_response

    except Exception as e:
        print(f"Exception while posting to Instagram: {str(e)}")
        return None


def post_to_twitter(post):
    """Post immediately to Twitter using post data"""

    user_id = post['user_id']
    tweet_text = post.get('tweet_text')
    image_url = post.get('image_url')

    # Fetch Twitter tokens
    token_obj = UserToken.query.filter_by(user_id=user_id).first()
    if not token_obj:
        print(f"Error: Twitter token not found for user {user_id}")
        return None

    access_token = token_obj.oauth_token
    access_token_secret = token_obj.oauth_token_secret

    try:
        oauth = OAuth1(
            CLIENT_ID, CLIENT_SECRET,
            access_token, access_token_secret
        )

        media_id = None

        # If there's an image, upload it first
        if image_url:
            response = requests.get(image_url, stream=True)
            if response.status_code == 200:
                parsed_url = urlparse(image_url)
                filename = os.path.basename(parsed_url.path)
                image_path = f"/tmp/{secure_filename(filename)}"

                with open(image_path, 'wb') as img_file:
                    for chunk in response.iter_content(1024):
                        img_file.write(chunk)

                with open(image_path, 'rb') as image:
                    media_data = {'media': image}
                    media_response = requests.post(UPLOAD_MEDIA_URL, auth=oauth, files=media_data)

                os.remove(image_path)  # Clean up temporary file

                if media_response.status_code == 200:
                    media_id = media_response.json().get("media_id_string")
                    print(f"Media uploaded successfully: {media_id}")
                else:
                    print(f"Twitter media upload failed: {media_response.status_code}, {media_response.text}")
                    return None
            else:
                print(f"Failed to download image from URL: {image_url}")
                return None

        # Post the Tweet
        payload = {"text": tweet_text}
        if media_id:
            payload["media"] = {"media": {"media_ids": [media_id]}}

        headers = {"Content-Type": "application/json"}
        response = requests.post(POST_TWEET_URL, auth=oauth, json=payload, headers=headers)

        if response.status_code not in [200, 201]:
            print(f"Tweet post failed: {response.status_code}, {response.text}")
            return None

        print("Successfully posted to Twitter:", response.json())

        # Update the database to mark this tweet as posted
        post_id = post['id']  # Assuming the scheduled post has an 'id'
        scheduled_tweet = ScheduledTweet.query.filter_by(id=post_id).first()

        if scheduled_tweet:
            scheduled_tweet.posted = True
            db.session.commit()
            print(f"Tweet with ID {post_id} marked as posted.")
        else:
            print(f"Scheduled tweet with ID {post_id} not found in database.")

        return response.json()

    except Exception as e:
        print(f"Exception while posting to Twitter: {str(e)}")
        return None





from threading import Lock

# Global flag and lock for job control
job_running = False
job_lock = Lock()

def post_scheduled_posts():
    global job_running
    with job_lock:
        if job_running:
            print("Job already running, skipping the new execution.")
            return
        
        job_running = True
        print("Job started.")

    try:
        from app import app  # Import the Flask app
        with app.app_context():  # Ensure the function runs inside the application context
            print('Scheduler function called!')


            dict = check_all_scheduled_posts()

            reddit_posts = dict['reddit']
            twitter_posts = dict['twitter']
            facebook_posts = dict['facebook']
            instagram_posts = dict['instagram']

            print("---------------------------------------------")
            if facebook_posts:
                print(f'Facebook posts : {len(facebook_posts)}')
                for post in facebook_posts:
                    post_to_facebook(post)
            if reddit_posts:
                print(f'Reddit posts : {len(reddit_posts)}')
                for post in reddit_posts:
                    # print(post)
                    post_to_reddit(post)
            if instagram_posts:
                print(f'Instagram posts : {len(instagram_posts)}')
                for post in instagram_posts:
                    post_to_instagram(post)
            print("---------------------------------------------")
                    
            

            # Add more platforms if needed

    except Exception as e:
        print(f"Error checking scheduled posts: {str(e)}")

    finally:
        with job_lock:
            job_running = False  # Mark the job as finished
            print("Job finished.")