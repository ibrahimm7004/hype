from Ai.M2_meme_gen import sm1_keyword_extraction
from Ai.M2_meme_gen import sm2_scoring
from Ai.M2_meme_gen import sm3_text_generation
from Ai.M2_meme_gen import sm4_meme_creation
import pandas as pd

# loading memes dataset for matching
memes_df = pd.read_csv('Ai/M2_meme_gen/memes_dataset.csv')

# user_input_df = pd.DataFrame(columns=[
#     "Keywords", "Primary Audience", "Secondary Audience", "Industry",
#     "Product/Service", "Best Platforms", "Humor Style", "Emotion Targeted",
#     "Engagement Type", "Seasonality", "Tone Alignment"
# ])

# # extracting keywords from user prompt
# keywords = sm1_keyword_extraction.extract_keywords(
#     promptQna.keywords_prompt)

# user_input_df.loc[0] = [
#     keywords,
#     promptQna.primary_audience,
#     promptQna.secondary_audience,
#     promptQna.industry,
#     promptQna.product_service,
#     promptQna.best_platforms,
#     promptQna.humor_style,
#     promptQna.emotion_targeted,
#     promptQna.engagement_type,
#     promptQna.seasonality,
#     promptQna.tone_alignment
# ]

# matches_df = sm2_scoring.matching(user_input_df, memes_df)
# final_score_table = sm2_scoring.calculate_weighted_scores(matches_df)
# meme_texts = sm3_text_generation.generate_meme_text(
#     final_score_table.iloc[:3], user_input_df, keywords)

# print(meme_texts)

# for key, value in meme_texts.items():
#     sm4_meme_creation.generate_meme(key, value[0], value[1])


def generate_meme_from_json(promptText, promptQna):
    # Define the expected columns in DataFrame
    user_input_df = pd.DataFrame(columns=[
        "Keywords", "Primary Audience", "Secondary Audience", "Industry",
        "Product/Service", "Best Platforms", "Humor Style", "Emotion Targeted",
        "Engagement Type", "Seasonality", "Tone Alignment"
    ])

    # Extracting keywords from user prompt
    keywords = sm1_keyword_extraction.extract_keywords(promptText)

    # Define expected attributes
    expected_attributes = {
        "primary_audience": "Primary Audience",
        "secondary_audience": "Secondary Audience",
        "industry": "Industry",
        "product_service": "Product/Service",
        "best_platforms": "Best Platforms",
        "humor_style": "Humor Style",
        "emotion_targeted": "Emotion Targeted",
        "engagement_type": "Engagement Type",
        "seasonality": "Seasonality",
        "tone_alignment": "Tone Alignment"
    }

    # Map the attributes from promptQna to match DataFrame column names
    row_values = [keywords]  # Start with keywords
    for key in user_input_df.columns[1:]:  # Skip "Keywords" column
        # Find corresponding key in promptQna (if exists), otherwise set None
        prompt_key = next((k for k, v in expected_attributes.items() if v == key), None)
        row_values.append(promptQna.get(prompt_key, None))

    # Ensure row_values length matches the number of columns
    if len(row_values) != len(user_input_df.columns):
        raise ValueError(f"Column mismatch: Expected {len(user_input_df.columns)}, but got {len(row_values)}")

    # Append row safely
    user_input_df.loc[0] = row_values

    # Debugging output
    print("Final DataFrame Columns:", user_input_df.columns)
    print("Row Values:", row_values)

    # Print for debugging
    print("User Input DataFrame:\n", user_input_df.loc[0])
    



    matches_df = sm2_scoring.matching(user_input_df, memes_df)
    final_score_table = sm2_scoring.calculate_weighted_scores(matches_df)
    meme_texts = sm3_text_generation.generate_meme_text(
    final_score_table.iloc[:3], user_input_df, keywords)


    meme_output_paths = []
    for key, value in meme_texts.items():
        path = sm4_meme_creation.generate_meme(key, value[0], value[1])
        meme_output_paths.append(path)
        
    return meme_output_paths
    