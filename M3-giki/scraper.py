import requests
from bs4 import BeautifulSoup
import urllib3
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


def get_article_text(url):
    """Extract full readable text from a single article page."""
    res = requests.get(url, headers=headers, verify=False)
    soup = BeautifulSoup(res.content, 'html.parser')

    possible_divs = [
        soup.find('div', class_='kingster-single-article-content'),
        soup.find('div', class_='gdlr-core-blog-content'),
        soup.find('div', class_='entry-content'),
        soup.find('div', class_='tribe-events-single-event-description'),
    ]

    for div in possible_divs:
        if div:
            paragraphs = div.find_all(['p', 'div', 'li'])
            return "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))

    return "No content found"


def build_articles_dict(link_list):
    data = {}
    for i, url in enumerate(link_list):
        try:
            text = get_article_text(url)
            data[i] = text
        except Exception as e:
            print(f"[ERROR] Failed on {url}: {e}")
    return data


news_links = get_article_links_news(news_url)
events_links = get_article_links_events(events_url)

news_dict = build_articles_dict(news_links)
events_dict = build_articles_dict(events_links)

# Save the dictionaries to a txt file
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("News Articles:\n")
    for title, link in news_dict.items():
        f.write(f"{title}: {link}\n")
    
    f.write("\nEvents Articles:\n")
    for title, link in events_dict.items():
        f.write(f"{title}: {link}\n")

