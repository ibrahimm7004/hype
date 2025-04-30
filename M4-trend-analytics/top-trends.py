import os
from dotenv import load_dotenv
import openai

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_KEY"))


def get_trending_trends(social_media: str, location: str, trend_type: str, num: int = 10) -> list:
    prompt = (
        f"List the top {num} trending {trend_type} on {social_media} in {location} right now. "
        f"Return only a comma-separated list, no explanation."
    )

    response = client.responses.create(
        model="gpt-4.1",
        tools=[{
            "type": "web_search_preview",
            "user_location": {
                "type": "approximate",
                "country": location[:2].upper() if len(location) == 2 else "",
            },
            "search_context_size": "low"    # change to high after testing
        }],
        input=prompt,
        tool_choice={"type": "web_search_preview"}
    )

    raw_text = response.output_text.strip()
    trends = [trend.strip()[40]
              for trend in raw_text.split(',') if trend.strip()]
    return trends[:num]


# example usage: print(get_trending_trends('instagram', 'Pakistan', 'news', 5))

# trend_type: hastags, topics, memes, challenges, keywords, accounts, news
# social_media: reddit, twitter, facebook, instagram
# location: countries
# num: give option 1-10
