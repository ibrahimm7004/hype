
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from mydatabase import db, ScheduledTweet, UserToken  

scheduler = BackgroundScheduler()

def check_and_post_tweets():
    """ Fetches tweets that need to be posted and posts them """
    now = datetime.utcnow()
    pending_tweets = ScheduledTweet.query.filter(ScheduledTweet.scheduled_time <= now, ScheduledTweet.posted == False).all()

    for tweet in pending_tweets:
        post_tweet(tweet)

# Run every minute
scheduler.add_job(check_and_post_tweets, "interval", minutes=1)
scheduler.start()