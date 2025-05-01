from openai import OpenAI
import json
import os
from dotenv import load_dotenv
import user_input

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

OPTION_SETS = {
    "Primary Audience": ["Gen Z", "Millennials", "Young Adults", "Parents", "Professionals", "Gamers", "Students", "General Public"],
    "Humor Style": ["Sarcastic", "Wholesome", "Dark", "Witty", "Relatable", "Cringe", "Dry", "Absurd"]
}


def normalize_template_name(name):
    return name.lower().replace(" ", "_").replace("-", "_").strip("_")


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
      **Humor Style**: {structured_inputs["humor_style"]}

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
        "humor_style": user_row["Humor Style"],
        "location": user_input.location
    }

    for _, row in final_score_table.iterrows():
        meme_template_name = row["Meme Name"]
        meme_text = openai_call(
            meme_template_name, keywords_prompt, structured_inputs)

        normalized_name = normalize_template_name(meme_template_name)

        # Save using normalized name for reliable lookup later
        meme_texts_dict[normalized_name] = {
            "display_name": meme_template_name,
            "text": meme_text
        }

    return meme_texts_dict
