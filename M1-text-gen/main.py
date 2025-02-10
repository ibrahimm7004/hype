from openai import OpenAI
import json
import os
from dotenv import load_dotenv
import user_input

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))


def define_prompt():
    """Creates an improved AI prompt for generating funny marketing tweets."""
    prompt = """
    You are an AI copywriter that writes **viral, humorous Twitter marketing tweets** 
    using **trendy humor, location-based jokes, and engagement tactics**. 

    - Your response must be **under 280 characters** (Twitter's limit).  
    - Use **engaging wording, humor, and memes** relevant to the topic.  
    - Format the tweet to encourage **replies, likes, and retweets**.  
    - Always use **1-2 emojis** to enhance humor.  
    """

    if user_input.trendy_humour:
        prompt += """
        - The humor must be **Twitter-style**, incorporating **current top trends, memes, and internet culture**.  
        - Use **relatable, witty humor**.  
        """

    if user_input.location:
        prompt += f"""
        - The tweet must include **local humor, cultural references, and well-known jokes** from {user_input.location}.  
        - Use inside jokes, stereotypes, or well-known landmarks relevant to people in {user_input.location}.  
        """

    if user_input.language:
        prompt += f"""
        - Write the tweet in **{user_input.language}** but using **English alphabets** (Roman script).  
        - If {user_input.language} is not a recognized language, default to the most common language in {user_input.location}.  
        """

    if user_input.audience_type:
        prompt += f"""
        - The humor should be **optimized for {', '.join(user_input.audience_type)}**.  
        """

    if user_input.CTA:
        prompt += f"""
        - Naturally incorporate this **call-to-action (CTA)** into the joke: {user_input.CTA}.  
        - Do not force the CTA; make it blend naturally into the humor.  
        """

    return prompt


def openai_call():
    """Calls OpenAI API to generate a funny marketing tweet."""

    prompt_info = define_prompt()

    initial_prompt = "You are an AI that generates funny, engaging Twitter marketing tweets."
    final_prompt = ""

    if not user_input.type_post:  # post type is 'Poll'
        initial_prompt = "You are an AI that generates funny Twitter **polls** for marketing purposes."
        final_prompt = "- Remember to generate text for **Twitter polls**, not standard tweets."

    prompt = f"""
    {initial_prompt}
    - Your response must be **valid JSON format**.
    - The tweet must be **short, funny, and highly engaging**.
    - Ensure it follows the **post_text format**.
    {final_prompt}

    General Info: "{user_input.prompt}"

    The criteria for the text you must generate:
    {prompt_info}

    Format your response strictly as:
    {{
        "post_text": "Generated Tweet Text"
    }}
    """

    # Make OpenAI API call
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        tweet_output = json.loads(response.choices[0].message.content.strip())
        return tweet_output.get("post_text", "Error: Invalid JSON response")
    except json.JSONDecodeError:
        return "Error: Invalid JSON response"


print(openai_call())
