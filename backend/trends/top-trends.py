import os
from dotenv import load_dotenv
import openai

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_KEY"))


def get_trending_trends(social_media: str, location: str, trend_type: str, num: int = 10) -> list:
    # Create a natural prompt
    prompt = (
        f"List the top {num} trending {trend_type} on {social_media} in {location} right now. "
        f"Only return a comma-separated list. No numbers, no explanation, no extra text."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a social media trends analyst."},
                {"role": "user", "content": prompt}
            ]
        )

        raw_text = response.choices[0].message.content.strip()
        trends = [trend.strip() for trend in raw_text.split(',') if trend.strip()]
        return trends[:num]

    except Exception as e:
        print("Error fetching trends:", e)
        return []


# Example usage
if __name__ == "__main__":
    print(get_trending_trends('instagram', 'Pakistan', 'news', 5))
