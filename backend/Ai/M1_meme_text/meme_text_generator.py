from openai import OpenAI
import json
import os
from dotenv import load_dotenv


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))


def define_prompt(user_input):
    
    print('user input: ',user_input)
    
    """Creates an improved AI prompt for generating funny marketing tweets."""
    prompt = """
    You are an AI copywriter that writes **viral, humorous Twitter marketing tweets** 
    using **trendy humor, location-based jokes, and engagement tactics**. 

    - Your response must be **under 280 characters** (Twitter's limit).  
    - Use **engaging wording, humor, and memes** relevant to the topic.  
    - Format the tweet to encourage **replies, likes, and retweets**.  
    - Always use **1-2 emojis** to enhance humor.  
    """
    
    # print("user_input",user_input['location'])

    if user_input.get('trendy_humour'):
        prompt += """
        - The humor must be **Twitter-style**, incorporating **current top trends, memes, and internet culture**.  
        - Use **relatable, witty humor**.  
        """

    if user_input.get('location'):
        prompt += f"""
        - The tweet must include **local humor, cultural references, and well-known jokes** from {user_input.get('location')}.  
        - Use inside jokes, stereotypes, or well-known landmarks relevant to people in {user_input.get('location')}.  
        """

    if user_input.get('trendy_language'):
        prompt += f"""
        - Write the tweet in **{user_input.get('trendy_language')}** but using **English alphabets** (Roman script).  
        - If {user_input.get('trendy_language')} is not a recognized language, default to the most common language in {user_input.get('location')}.  
        """

    if user_input.get('audience_type'):
        prompt += f"""
        - The humor should be **optimized for {', '.join(user_input.get('audience_type'))}**.  
        """

    if user_input.get('CTA'):
        prompt += f"""
        - Naturally incorporate this **call-to-action (CTA)** into the joke: {user_input.get('CTA')}.  
        - Do not force the CTA; make it blend naturally into the humor.  
        """
        
    print('\n\n\nprompt:',prompt)

    return prompt


def openai_call(user_input):
    """Calls OpenAI API to generate a funny marketing tweet."""

    prompt_info = define_prompt(user_input)

    initial_prompt = "You are an AI that generates funny, engaging Twitter marketing tweets."
    final_prompt = ""

    if not user_input.get('type_post'):  # post type is 'Poll'
        initial_prompt = "You are an AI that generates funny Twitter **polls** for marketing purposes."
        final_prompt = "- Remember to generate text for **Twitter polls**, not standard tweets."

    prompt = f"""
    {initial_prompt}
    - Your response must be **valid JSON format**.
    - The tweet must be **short, funny, and highly engaging**.
    - Ensure it follows the **post_text format**.
    {final_prompt}

    General Info: "{user_input.get('prompt')}"

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



def meme_text_generator_function (user_input):
    
    print("generating text function...",user_input)
    

    
    
    # return "hello"
    return openai_call(user_input)