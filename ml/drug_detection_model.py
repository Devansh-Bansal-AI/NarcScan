# drug_detection_model.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import re
import numpy as np

# A dictionary to map emojis and common slang to a standard keyword.
# This helps the model generalize better.
SLANG_DICT = {
    '🍁': 'weed',
    '🔥': 'fire',
    '🔌': 'plug',
    '❄️': 'snow',
    '💊': 'pills',
    '🍄': 'shrooms',
    '⛽': 'gas',
    '📦': 'package',
    'dm': 'directmessage',
    'hmu': 'hitmeup',
    'hookup': 'connect',
    'white girl': 'cocaine',
    'drop point': 'meetup',
    'half-zip': 'halfzip'
}

# Preprocess text: normalize slang, handle emojis, and clean punctuation
def preprocess(text):
    text = text.lower()
    # Replace slang and emojis using the dictionary
    for slang, keyword in SLANG_DICT.items():
        text = text.replace(slang, keyword)
    
    # Remove punctuation and special characters, leaving only words
    text = re.sub(r'[^\w\s]', ' ', text)
    return text

# Much larger and more varied training data
train_texts = [
    "🍁🔥 top quality available wickr dealer123",
    "need plug in nyc dm for menu",
    "just posting about my gardening hobby",
    "looking for friends to hang out with",
    "special treats available signal only",
    "check out my new blog about technology",
    "Yo, I need a half-zip of that White Girl ❄️. What's the drop point and price?",
    "Got the brick 📦 ready. My guy will be at the meetup point in 15.",
    "Looking for party supplies. I only accept cashapp and venmo.",
    "I'm so excited for the new season of my favorite show!",
    "Looking for a new gaming PC, any recommendations?",
    "I have some new merchandise available for sale, DM for details.",
    "Just got some new kicks, directmessage for photos.",
    "I have some new seeds for my garden. Let me know if you want to trade.",
    "I'm at the meetup point, come get the goods.",
    "Looking to score an ounce or two for the weekend.",
    "I have a friend who can connect you, hitmeup.",
    "This new music album is fire.", # This is a clean use of a keyword.
    "I'm looking for a new direct message app.", # Clean use of a keyword.
    "Can you give me a direct message?", # Clean use of a keyword.
    "Let me know if you are looking for some snow.", # Suspicious.
    "Party at my place tonight, bring your friends!", # Clean.
    "What's a good price for a new phone?", # Clean.
    "My car is in the shop, I need a ride.", # Clean.
    "Can anyone connect me with a job opportunity?", # Clean.
    "Looking for some new plants for my balcony garden.", # Clean.
    "What's a good plug for laptop accessories?", # Clean.
    "Got the pills from the plug, ready to go.", # Highly suspicious.
    "I'm feeling so happy, these treats are amazing!", # Suspicious.
    "Let's get some food and chill tonight." # Clean.
]
# Corresponding labels
train_labels = [
    1, 1, 0, 0, 1, 0, 1, 1, 1, 0,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0
]

# Vectorize text using TF-IDF and bigrams/trigrams
vectorizer = TfidfVectorizer(preprocessor=preprocess, ngram_range=(1, 3))
X = vectorizer.fit_transform(train_texts)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X, train_labels)

# Save model
pickle.dump({'model': model, 'vectorizer': vectorizer}, open('model.pkl', 'wb'))

# Prediction function
def predict(text):
    data = pickle.load(open('model.pkl', 'rb'))
    model = data['model']
    vectorizer = data['vectorizer']
    X = vectorizer.transform([text])
    proba = model.predict_proba(X)[0][1]
    return float(proba)