from openai import OpenAI
import json
import os
from dotenv import load_dotenv
import user_input

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

    lang_prompt = """
        - Write the meme text using English only. 
        """

    if user_input.language:
        lang_prompt = f"""
        - Generate the meme text in **{user_input.language}** but using **English alphabets** (Roman script).  
        - If {user_input.language} is not a recognized language, default to the most common language in {user_input.location}.  
        """

    prompt = f"""
    You are a **hilarious meme creator** with **perfect comedic timing** and you write **viral, hilarious, and unhinged** tweets for marketing. .  
    Your goal is to create **viral**, **relatable**, and **meme-worthy** content.
    Your memes should sound **effortlessly funny**, **not forced or corporate**.
    - **Absolutely NO vulgarity or profanity**.
    - Make it **laugh-out-loud funny**—think **sarcasm, irony, relatable humor, and meme energy**.  
    - **Punchy, no fluff.** Make it feel like something you'd retweet at 2 AM.  
    - **Emojis?** Yes, but like a spice—**just enough, never too much**.  

    - **The meme must always have two lines of text.**  
    - **First line: Sets up the joke.**  
    - **Second line: Delivers the punchline.**  

    - {lang_prompt}

    - Ensure the meme is funny for the target audience:  
      **Primary Audience:** {structured_inputs["primary_audience"]}  
      **Secondary Audience:** {structured_inputs["secondary_audience"]}  
      **Industry:** {structured_inputs["industry"]}  
      **Emotion Targeted:** {structured_inputs["emotion_targeted"]}  

    - If relevant, use humor specific to **{user_input.location}**, including inside jokes, funny stereotypes, or pop culture references.
    - Make fun of **{user_input.location}** like an insider.  
    - Use **local jokes, funny stereotypes, or inside humor** that only people from {user_input.location} would get.  
    - No robotic "cultural references"—**roast them, meme them, but make it fun**.  

    Meme Template: **{meme_template_name}**  

    General Context: "{keywords_prompt}"  

    **Strict Formatting Rule:**  
    Return the meme text as **valid JSON** in this exact format:  
    {{
        "meme_text": [
            "First line of meme",
            "Second line of meme"
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
        "tone_alignment": user_row["Tone Alignment"],
        "location": user_input.location
    }

    for _, row in final_score_table.iterrows():
        meme_template_name = row["Meme Name"]

        meme_text = openai_call(
            meme_template_name, keywords_prompt, structured_inputs)

        meme_texts_dict[meme_template_name] = meme_text

    return meme_texts_dict
