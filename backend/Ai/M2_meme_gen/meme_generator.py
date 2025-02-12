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
    user_input_df = pd.DataFrame(columns=[
        "Keywords", "Primary Audience", "Secondary Audience", "Industry",
        "Product/Service", "Best Platforms", "Humor Style", "Emotion Targeted",
        "Engagement Type", "Seasonality", "Tone Alignment"
    ])
    

    

    # extracting keywords from user prompt
    keywords = sm1_keyword_extraction.extract_keywords(promptText)
    # Available attributes from promptQna
    # Define expected attributes
    expected_attributes = [
        "primary_audience", "secondary_audience", "industry", "product_service",
        "best_platforms", "humor_style", "emotion_targeted", "engagement_type",
        "seasonality", "tone_alignment"
    ]

    # Ensure 'keywords' column is always present
    columns = ["Keywords"] + [key for key in expected_attributes if key in promptQna]

    # Ensure the DataFrame has the correct columns
    # user_input_df = pd.DataFrame(columns=columns)

    # Ensure 'keywords' value is present
    row_values = [keywords] + [[promptQna.get(key, None)] for key in columns[1:]]

    # Append row safely
    user_input_df.loc[0] = row_values

    # Print for debugging
    print("User Input DataFrame:\n", user_input_df.loc[0])
    



    matches_df = sm2_scoring.matching(user_input_df, memes_df)
    # return
    
    final_score_table = sm2_scoring.calculate_weighted_scores(matches_df)
    meme_texts = sm3_text_generation.generate_meme_text(
        final_score_table.iloc[:3], user_input_df, keywords)

    print(meme_texts)

    meme_output_paths = []
    for key, value in meme_texts.items():
        path = sm4_meme_creation.generate_meme(key, value[0], value[1])
        meme_output_paths.append(path)
        
    return meme_output_paths
    