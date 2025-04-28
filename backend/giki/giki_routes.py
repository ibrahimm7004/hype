from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from mydatabase.database import db
from mydatabase.models import User
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
giki_bp = Blueprint("giki", __name__)
import requests
from bs4 import BeautifulSoup
import urllib3
from datetime import datetime
import json

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

news_url = 'https://giki.edu.pk/highlights'
events_url = 'https://giki.edu.pk/events'

headers = {
    'User-Agent': 'Mozilla/5.0'
}


def get_article_links_news(page_url):
    """Extract article URLs from News page."""
    res = requests.get(page_url, headers=headers, verify=False)
    soup = BeautifulSoup(res.content, 'html.parser')
    return [a['href'] for a in soup.select('a.gdlr-core-excerpt-read-more')]


def get_article_links_events(page_url):
    """Extract article URLs from Events page."""
    res = requests.get(page_url, headers=headers, verify=False)
    soup = BeautifulSoup(res.content, 'html.parser')
    return [a['href'] for a in soup.select('h3.tribe-events-calendar-list__event-title a')]




def get_new_data(url):
    """Extract full readable text from a single article page and return as a JSON object."""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    res = requests.get(url, headers=headers, verify=False)
    soup = BeautifulSoup(res.content, 'html.parser')
    
    # Extract title (first h1 tag with class 'kingster-single-article-title')
    title = soup.find('h1', class_='kingster-single-article-title')
    if title:
        title_text = title.text.strip()
    else:
        title_text = "Title not found"
    
    # Extract date (find the div with the class 'kingster-blog-info-date' and get the text inside <a>)
    date_div = soup.find('div', class_='kingster-blog-info kingster-blog-info-font kingster-blog-info-date post-date updated')
    if date_div:
        date = date_div.find('a').text.strip()
    else:
        date = "Date not found"
    
    # Extract content
    possible_divs = [
        soup.find('div', class_='kingster-single-article-content'),
        soup.find('div', class_='gdlr-core-blog-content'),
        soup.find('div', class_='entry-content'),
        soup.find('div', class_='tribe-events-single-event-description'),
    ]

    for div in possible_divs:
        if div:
            paragraphs = div.find_all(['p', 'div', 'li'])
            text_content = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))
            break
    else:
        text_content = "No content found"

    # Return as JSON
    article_data = {
        "link": url,
        "title": title_text,
        "date": date,
        "text": text_content
    }
    
    return json.dumps(article_data, ensure_ascii=False, indent=4)


def get_events_data(url):
    """Extract title, link, and date from an article."""
    res = requests.get(url, headers=headers, verify=False)
    soup = BeautifulSoup(res.content, 'html.parser')

    # Extract title (first h1 tag with class 'kingster-single-article-title')
    title_tag = soup.find('h3', class_='kingster-page-title')
    title = title_tag.get_text(strip=True) if title_tag else "Untitled Event"

    


    date = soup.find('abbr', class_='tribe-events-abbr tribe-events-start-date published dtstart')
    if date:
        date = date.text.strip()
    else:
        date = "Date not found"

    time = soup.find('div', class_='tribe-events-abbr tribe-events-start-time published dtstart')
    if time:
        time = time.text.strip()
    else:
        time = "Date not found"

    # print(f"Title: {title_text}")
    # print(f"Date: {date}")
    # print(f"Time: {time}")
    # print("--------------------------\n")

    return {
        'title': title,
        'link': url,
        'date': date,
        'time':time,
    }




# news_links = get_article_links_news(news_url)
# events_links = get_article_links_events(events_url)

# news_dict = build_articles_dict(news_links)
# events_dict = build_articles_dict(events_links)



# urls = [
#     'https://giki.edu.pk/2025/04/11/mentorship-session-highlights-with-mr-raza-jafar/',
#     'https://giki.edu.pk/2025/04/11/seminar-highlights-ai-engineering-industry-landscape-and-trends/',
#     'https://giki.edu.pk/2025/04/11/3rd-international-conference-on-emerging-power-technologies-icept/',
#     'https://giki.edu.pk/2025/03/11/the-supreme-court-of-pakistan-scp-has-signed-mous-with-ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology-giki-and-lahore-university-of-management-sciences-lums-to-enhance-judic/',
#     'https://giki.edu.pk/2025/03/11/google-developers-group-on-campus-giki-in-collaboration-with-bave-technologies-and-the-catalyst-gik-incubator-successfully-hosted-a-three-day-event-exploring-the-frontiers-of-artificial-intelligenc/',
#     'https://giki.edu.pk/2025/03/11/giki-celebrates-womens-day-honoring-the-strength-achievements-and-limitless-potential-of-women-in-every-walk-of-life/',
#     'https://giki.edu.pk/2025/03/11/%f0%9d%97%9a%f0%9d%97%9c%f0%9d%97%9e%f0%9d%97%9c-%f0%9d%97%98%f0%9d%97%ba%f0%9d%97%b2%f0%9d%97%bf%f0%9d%97%b4%f0%9d%97%b6%f0%9d%97%bb%f0%9d%97%b4-%f0%9d%97%a7%f0%9d%97%b2%f0%9d%97%b0%f0%9d%97%b5/',
#     'https://giki.edu.pk/2025/03/11/highlights-from-the-icpc-asia-west-continent-finals-2024/',
#     'https://giki.edu.pk/2025/02/28/the-generative-ai-for-executives-training-program-at-ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology-successfully-concluded-bringing-together-top-industry-leaders-ceos-entrep/',
#     'https://giki.edu.pk/2025/02/28/leading-national-and-multinational-companies-participated-in-giki-career-fair-2025/',
#     'https://giki.edu.pk/event/giki-industrial-open-house-2025/'
# ]


@giki_bp.route('/giki-news', methods=['GET'])
def fetch_giki_news():
    """Fetch GIKI news articles and return as JSON."""
    try:
        news_links = get_article_links_news(news_url)
        news_data = []

        for link in news_links:
            full_url = link if link.startswith('http') else f"https://giki.edu.pk{link}"
            article_json = json.loads(get_new_data(full_url))
            news_data.append(article_json)

        return jsonify({"status": "success", "news": news_data}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@giki_bp.route('/giki-events', methods=['GET'])
def fetch_giki_events():
    """Fetch GIKI events and return as JSON."""
    print("debug")
    try:
        print("debug1")
        events_links = get_article_links_events(events_url)
        print("debug2")
        events_data = []
        
        

        for link in events_links:
            try:
                full_url = link if link.startswith('http') else f"https://giki.edu.pk{link}"
                print(f"Fetching event from: {full_url}")
                event_info = get_events_data(full_url)
                print(f"Fetched event: {event_info}")
                events_data.append(event_info)
            except Exception as e:
                print(f"Error fetching event from {link}: {e}")


        return jsonify({"status": "success", "events": events_data}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
