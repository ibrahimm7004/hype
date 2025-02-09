import spacy

nlp = spacy.load("en_core_web_sm")

# Predefined mappings
INDUSTRY_MAP = {"shoes": "Fashion", "fashion": "Fashion", "apparel": "Fashion",
                "fitness": "Healthcare", "software": "Tech", "app": "Tech",
                "food": "Food", "restaurant": "Food", "eco-friendly": "Sustainability"}

INTENT_MAP = {"promote": "Awareness", "sell": "Sales", "advertise": "Awareness",
              "launch": "Awareness", "boost": "Engagement", "create": "Awareness"}

EMOTION_MAP = ["excitement", "FOMO", "regret", "urgency"]
HUMOR_MAP = ["sarcastic", "dark", "relatable", "corporate", "funny"]
AUDIENCE_MAP = ["gen z", "millennials", "professionals", "gym enthusiasts"]


def extract_keywords(text):
    doc = nlp(text.lower())
    keywords = []

    # Extract location
    for ent in doc.ents:
        if ent.label_ == "GPE":
            keywords.append(ent.text.capitalize())

    # Extract keywords and map to categories
    for token in doc:
        lemma = token.lemma_.lower()
        if token.is_stop or token.is_punct:
            continue

        if lemma in INDUSTRY_MAP:
            keywords.append(INDUSTRY_MAP[lemma])
        if lemma in INTENT_MAP:
            keywords.append(INTENT_MAP[lemma])
        if lemma in EMOTION_MAP:
            keywords.append(lemma.capitalize())
        if lemma in HUMOR_MAP:
            keywords.append(lemma.capitalize())
        if lemma in AUDIENCE_MAP:
            keywords.append(lemma.capitalize())

        keywords.append(lemma)

    # Capture multi-word humor types
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower()
        if chunk_text in HUMOR_MAP:
            keywords.append(chunk_text.capitalize())

    return list(set(keywords))  # Remove duplicates
