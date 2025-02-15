from openai import OpenAI
import json
import os
from dotenv import load_dotenv
from types import SimpleNamespace


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))


def define_prompt(user_input):
    """Creates a looser, funnier AI prompt for generating viral marketing tweets."""
    prompt = """
    You're a **Twitter mastermind** who writes **viral, hilarious, and unhinged** tweets for marketing. 
    Your tweets should sound **effortlessly funny**, **not forced or corporate**.

    - **Absolutely NO vulgarity or profanity**.
    - Make it **laugh-out-loud funny**—think **sarcasm, irony, relatable humor, and meme energy**.  
    - Under **280 characters**.
    - If a **meme format** fits, use it.  
    - **Punchy, no fluff.** Make it feel like something you'd retweet at 2 AM.  
    - **Emojis?** Yes, but like a spice—**just enough, never too much**.  
    """

    if user_input.location and user_input.trendy_humour:
        prompt += f"""
        - Make fun of **{user_input.location}** like an insider.  
        - Use **local jokes, funny stereotypes, or inside humor** that only people from {user_input.location} would get.  
        - No robotic "cultural references"—**roast them, meme them, but make it fun**.  
        """
        if user_input.trendy_language:
            prompt += f"""
            - Write in **{user_input.trendy_language}** (but using Roman script).  
            - If {user_input.trendy_language} isn’t valid, use the most common language in {user_input.location}.  
            """
        else:
            prompt += """
            - Default to English with some slang if it helps.  
            """

    if user_input.trendy_humour:
        prompt += """
        - If a **meme format is trending**, slap that in there.  
        - **Steal from Twitter's humor playbook**—unhinged, chaotic, unpredictable.  
        - **NO corporate-sounding jokes.** If it sounds like a LinkedIn post, start over.  
        """

    if user_input.audience_type:
        prompt += f"""
        - Tailor the humor for **{', '.join(user_input.audience_type)}**, but don’t make it obvious.  
        - Subtle, inside jokes hit better than "hello fellow kids" energy.  
        """

    if user_input.CTA:
        prompt += f"""
        - Sneak in this CTA: **"{user_input.CTA}"**, but make it feel like an afterthought.  
        - Example: "**Buy it or don’t, but don’t blame me when your life is boring.**"  
        """

    return prompt


def openai_call(user_input):
    """Calls OpenAI API to generate a funny marketing tweet."""

    prompt_info = define_prompt(user_input)

    initial_prompt = "You are an AI that generates funny, engaging Twitter marketing tweets. Remember to generate tweets only, not polls."
    final_prompt = ""
    response_criteria = f"""
        Format your response strictly as:
        {{
            "generated_text": "Generated Tweet Text"
        }}
        """

    if not user_input.type_post:  # post type is 'Poll'
        initial_prompt = "You are an AI that generates funny Twitter **polls** for marketing purposes."
        final_prompt = """
        - Remember to generate text for **Twitter polls**, not standard tweets.
        """
        response_criteria = f"""
        Format your response strictly as:
        {{
            "generated_text": {{
                "question": "Poll Question Here",
                "options": [
                    "Option 1",
                    "Option 2"
                ]
            }}
        }}
        """

    prompt = f"""
    {initial_prompt}
    - Your response must be **valid JSON format**.
    - The tweet must be **short, funny, and highly engaging**.
    - Ensure it follows the **post_text format**.
    {final_prompt}

    General Info: "{user_input.prompt}"

    The criteria for the text you must generate:
    {prompt_info}

    {response_criteria}
    """

    # Make OpenAI API call
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        tweet_output = json.loads(response.choices[0].message.content.strip())
        return tweet_output.get("generated_text", "Error: Invalid JSON response")
    except json.JSONDecodeError:
        return "Error: Invalid JSON response"


def meme_text_generator_function (input):
    
    
    
    print("generating text function...",input)
    user_input = SimpleNamespace(**input)


    
    
    # return "hello"
    return openai_call(user_input)