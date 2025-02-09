import pandas as pd


def matching(user_input_df, memes_dataset_loaded):
    matches_df = pd.DataFrame(columns=memes_dataset_loaded.columns)
    matches_df["Meme Name"] = memes_dataset_loaded["Meme Name"]

    for col in user_input_df.columns:
        if col == "Meme Name":
            continue

        user_values = user_input_df[col].iloc[0]

        if isinstance(user_values, (list, set)):
            user_values = list(user_values)
        elif isinstance(user_values, str):
            try:
                user_values = eval(user_values) if user_values.startswith(
                    "[") and user_values.endswith("]") else [user_values]
            except:
                user_values = [user_values]
        elif pd.isna(user_values) or user_values is None:
            user_values = []
        else:
            user_values = [user_values]

        match_scores = []

        for _, meme_row in memes_dataset_loaded.iterrows():
            meme_values = meme_row[col]

            if isinstance(meme_values, (list, set)):
                meme_values = list(meme_values)
            elif isinstance(meme_values, str):
                try:
                    meme_values = eval(meme_values) if meme_values.startswith(
                        "[") and meme_values.endswith("]") else [meme_values]
                except:
                    meme_values = [meme_values]
            elif pd.isna(meme_values) or meme_values is None:
                meme_values = []
            else:
                meme_values = [meme_values]

            if not user_values:
                match_score = 0
            elif len(user_values) == 1:
                match_score = 1 if user_values[0] in meme_values else 0
            else:
                matched_count = sum(
                    1 for value in user_values if value in meme_values)
                match_score = matched_count / \
                    len(user_values) if len(user_values) > 0 else 0

            match_scores.append(match_score)

        matches_df[col] = match_scores

    return matches_df


def calculate_weighted_scores(matches_df):
    WEIGHTS = {
        "Keywords": 0.1613,
        "Humor Style": 0.1613,
        "Emotion Targeted": 0.1613,
        "Tone Alignment": 0.0968,
        "Primary Audience": 0.0968,
        "Seasonality": 0.0968,
        "Best Platforms": 0.0968,
        "Secondary Audience": 0.0323,
        "Engagement Type": 0.0323,
        "Industry": 0.0323,
        "Product/Service": 0.0323
    }

    matches_df["Score"] = 0

    for feature, weight in WEIGHTS.items():
        matches_df["Score"] += matches_df[feature] * weight

    matches_df = matches_df.sort_values(
        by="Score", ascending=False).reset_index(drop=True)

    return matches_df
