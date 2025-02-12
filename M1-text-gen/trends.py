from openai import OpenAI
import json
import os
from dotenv import load_dotenv
from datetime import date

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))


def openai_call(location):  # or take param as location=user_input.location

    prompt = f"""
    Your task is to find and determine:
    - **{location}-based real-time trending topics** for **creating funny memes**. 
    - These should include **viral discussions, popular memes, breaking news, or cultural moments** that are driving interactions online. 
    - Don't give me hashtags or keywords, I want general hot topics. 

    Each topic you choose **must be:**:
    - trending **right now** on {date.today()}.
    - funny 

    You must return:
    - the **top 5 topics**
    - concisely as **single statements between 1-5 words** 
    - Format the response strictly as JSON.

    **Example JSON Response:**  
    {{"trending_topics":{{
        "topic 1": "statement 1",  
        "topic 2": "statement 2",  
        "topic 3": "statement 3", 
        "topic 4": "statement 4", 
        "topic 5": "statement 5"  
    }}}}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        tweet_output = json.loads(response.choices[0].message.content.strip())
        return tweet_output.get("trending_topics", "Error: Invalid JSON response")
    except json.JSONDecodeError:
        return "Error: Invalid JSON response"
