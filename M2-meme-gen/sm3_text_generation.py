from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

OPTION_SETS = {
    "Primary Audience": ["Kids", "Teens", "Young Adults", "Millennials", "Adults", "Older Adults", "General Audience (All)"],
    "Secondary Audience": ["Teens", "Young Adults", "Millennials", "Adults", "Older Adults", "General Audience (All)", "Professionals", "Tech Enthusiasts", "Gamers", "Pop Culture Fans"],
    "Industry": ["eCommerce", "Fashion & Beauty", "Food & Beverage", "Tech & Software", "Finance", "Healthcare", "Education", "Entertainment", "Automotive", "Travel", "B2B", "General"],
    "Product/Service": ["Physical Products", "Luxury Goods", "Subscription Services", "Food & Beverages", "Events & Experiences", "Tech Products", "Education & Courses", "B2B Services", "Brand Awareness"],
    "Best Platforms": ["Instagram", "Facebook", "Twitter (X)", "General"],
    "Humor Style": ["Relatable", "Sarcastic", "Wholesome", "Dark Humor", "Satirical", "Self-Deprecating", "Absurd", "Workplace", "Pop Culture", "Nostalgic", "Reaction-Based"],
    "Emotion Targeted": ["FOMO", "Excitement", "Regret", "Confidence", "Shock", "Confusion", "Happiness", "Frustration", "Empowerment", "Curiosity"],
    "Engagement Type": ["Tag a Friend", "Shareable", "Call to Action", "Comment Bait", "Self-Identification", "Educational", "Controversial", "Nostalgic", "Entertainment"],
    "Seasonality": ["Evergreen", "Summer", "Winter", "Black Friday", "Christmas", "Halloween", "Back to School", "Valentine’s Day", "April Fools", "Other Holidays"],
    "Tone Alignment": ["Playful", "Premium Yet Fun", "Professional", "Luxury", "Edgy", "Trendy", "Nostalgic", "Corporate", "General"]
}


def openai_call(meme_template_name, keywords_prompt, structured_inputs):
    prompt = f"""
    You are an AI meme generator that produces structured meme text for different meme templates.
    - Always return the output in **valid JSON format**.
    - Ensure the output follows the specific **meme template's format**.
    - Base your meme text on the provided **keywords** and **structured inputs**.
    - Your response must **ONLY contain the formatted meme text in JSON**.
    - The meme format ALWAYS has exactly **two lines of text**.

    Meme Template: {meme_template_name}

    General Context: "{keywords_prompt}"

    Detailed Context:
    {json.dumps(structured_inputs, indent=2)}

    Format your response strictly as:
    {{
        "meme_text": [
            "Line 1 of meme",
            "Line 2 of meme"
        ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        meme_text_output = json.loads(
            response.choices[0].message.content.strip())
        return meme_text_output.get("meme_text", ["Error: Invalid JSON response"])
    except json.JSONDecodeError:
        return ["Error: Invalid JSON response"]


def generate_meme_text(final_score_table, user_input_df, keywords_prompt):
    meme_texts_dict = {}

    user_row = user_input_df.iloc[0]

    structured_inputs = {
        "primary_audience": user_row["Primary Audience"],
        "secondary_audience": user_row["Secondary Audience"],
        "industry": user_row["Industry"],
        "product_service": user_row["Product/Service"],
        "best_platforms": user_row["Best Platforms"],
        "humor_style": user_row["Humor Style"],
        "emotion_targeted": user_row["Emotion Targeted"],
        "engagement_type": user_row["Engagement Type"],
        "tone_alignment": user_row["Tone Alignment"]
    }

    for _, row in final_score_table.iterrows():
        meme_template_name = row["Meme Name"]

        meme_text = openai_call(
            meme_template_name, keywords_prompt, structured_inputs)

        meme_texts_dict[meme_template_name] = meme_text

    return meme_texts_dict
