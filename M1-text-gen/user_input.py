import trends

# prompt = "We run a travel booking platform that helps users find the best flight and hotel deals. It’s perfect for frequent travelers, budget-conscious tourists, and spontaneous adventurers."
location = "Pakistan"
language = "Urdu"

trendy_humour = True    # default set to True
if trendy_humour is True:
    trends_list = trends.openai_call(location)
    trends_list["topic 6"] = "General Trends"
# trends_list will be following this format:
# {'topic 1': 'Weather chaos memes', 'topic 2': "Valentine's Day mishaps", 'topic 3': 'Election season blunders', 'topic 4': 'TikTok dance fails', 'topic 5': 'School exam panic', 'topic 6': 'General Trends'}
# If user selects General Trends, we'll default to the big 3 on X: sports, politics, tech.

audience_type = ["Young Adults / Gen Z (18-24)"]
CTA = []
type_post = True    # default set to True
prompt = "We run a coffee shop in Lahore named Beano. We want funny, trendy tweets to attract customers."
