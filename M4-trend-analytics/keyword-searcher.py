import requests
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords


def get_reddit_trends(industry, limit=500):
    headers = {'User-Agent': 'trend-analyzer/0.1'}
    stop_words = set(stopwords.words('english'))

    url = f"https://www.reddit.com/search.json?q={industry}&sort=top&t=week&limit={limit}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Failed to fetch Reddit data.")
        return

    posts = response.json()['data']['children']
    titles = [post['data']['title'] for post in posts]

    # Extract words from titles
    words = re.findall(r'\b\w{4,}\b', ' '.join(titles).lower())
    filtered_words = [w for w in words if w not in stop_words]

    top_keywords = Counter(filtered_words).most_common(15)

    for word, count in top_keywords:
        print(f"{word}: {count}")


# Example usage
industry_input = input(
    "Enter a topic: ").strip()
get_reddit_trends(industry_input)
