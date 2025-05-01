import sm1_keyword_extraction
import user_input
import sm2_scoring
import sm3_text_generation
import sm4_meme_creation
import pandas as pd

# loading memes dataset for matching
memes_df = pd.read_csv(
    r'C:\Users\hp\Desktop\fyp\mvp\M2-meme-gen\meme_features_new.csv')

user_input_df = pd.DataFrame(columns=[
    "Keywords", "Primary Audience", "Humor Style"
])

# extracting keywords from user prompt
keywords = sm1_keyword_extraction.extract_keywords(
    user_input.keywords_prompt)

user_input_df.loc[0] = [
    keywords,
    user_input.primary_audience,
    user_input.humor_style
]

matches_df = sm2_scoring.matching(user_input_df, memes_df)
final_score_table = sm2_scoring.calculate_weighted_scores(matches_df)
meme_texts = sm3_text_generation.generate_meme_text(
    final_score_table.iloc[:3], user_input_df, keywords)

print(meme_texts)

for key, value in meme_texts.items():
    top_text, bottom_text = value["text"]
    sm4_meme_creation.generate_meme(key, top_text, bottom_text)
