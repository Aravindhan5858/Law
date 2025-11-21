"""
Legal Case Advisor - ML Service
NLP-based IPC Section Prediction using TF-IDF + Naive Bayes
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import joblib
import os
import json
import numpy as np

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("⚠️  spaCy model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None

# Global model variables
model = None
vectorizer = None
sections_map = {}

class LegalTextPreprocessor:
    """Preprocessor for legal text using spaCy NLP"""
    
    def __init__(self, nlp_model):
        self.nlp = nlp_model
    
    def preprocess(self, text):
        """
        Preprocess text: lowercase, lemmatize, remove stopwords
        """
        if not self.nlp:
            return text.lower()
        
        # Process with spaCy
        doc = self.nlp(text.lower())
        
        # Lemmatize and remove stopwords, punctuation
        tokens = [
            token.lemma_ 
            for token in doc 
            if not token.is_stop and not token.is_punct and token.is_alpha
        ]
        
        return ' '.join(tokens)

# Initialize preprocessor
preprocessor = LegalTextPreprocessor(nlp) if nlp else None

# Training dataset
TRAINING_DATA = [
    # IPC 323 - Assault
    ("He hit me in the street", "323"),
    ("Someone punched me", "323"),
    ("He beat me up", "323"),
    ("Physical assault happened", "323"),
    ("He slapped me", "323"),
    ("Someone attacked me physically", "323"),
    
    # IPC 379 - Theft
    ("Someone stole my bag", "379"),
    ("My phone was stolen", "379"),
    ("Theft of my property", "379"),
    ("Someone took my wallet", "379"),
    ("My bike was stolen", "379"),
    ("Property theft occurred", "379"),
    
    # IPC 420 - Cheating
    ("He cheated me online", "420"),
    ("Fraud in online transaction", "420"),
    ("He deceived me for money", "420"),
    ("Online shopping fraud", "420"),
    ("Product not delivered after payment", "420"),
    ("He took money and disappeared", "420"),
    ("Cheating in business deal", "420"),
    
    # IPC 506 - Criminal Intimidation
    ("He threatened to kill me", "506"),
    ("Death threats received", "506"),
    ("Someone is threatening my family", "506"),
    ("Received intimidating messages", "506"),
    ("He said he will harm me", "506"),
    
    # IPC 354 - Assault/Criminal Force on Woman
    ("Molestation happened", "354"),
    ("Inappropriate touching", "354"),
    ("Sexual harassment at workplace", "354"),
    ("Outraging modesty of woman", "354"),
    
    # IPC 376 - Rape
    ("Sexual assault happened", "376"),
    ("Rape incident", "376"),
    ("Sexual violence", "376"),
    
    # IPC 302 - Murder
    ("Someone killed my brother", "302"),
    ("Murder happened", "302"),
    ("He was killed", "302"),
    ("Culpable homicide", "302"),
    
    # IPC 406 - Criminal Breach of Trust
    ("Money was entrusted and misappropriated", "406"),
    ("He misused my funds", "406"),
    ("Breach of trust in business", "406"),
    
    # IPC 498A - Cruelty by Husband/Relatives
    ("Dowry harassment", "498A"),
    ("Husband torturing me", "498A"),
    ("In-laws demanding dowry", "498A"),
    ("Domestic violence by husband", "498A"),
    
    # IPC 304 - Culpable Homicide
    ("Death due to negligence", "304"),
    ("Culpable homicide not murder", "304"),
    
    # IPC 392 - Robbery
    ("Armed robbery happened", "392"),
    ("Robbed at gunpoint", "392"),
    ("Dacoity incident", "392"),
    
    # IPC 467 - Forgery
    ("Forged documents", "467"),
    ("Fake signature on papers", "467"),
    ("Document forgery", "467"),
    
    # IT Act 66D - Cheating using Computer
    ("Cyber fraud", "66D"),
    ("Online hacking", "66D"),
    ("Phishing scam", "66D"),
    ("Credit card fraud online", "66D"),
    
    # IPC 504 - Intentional Insult
    ("He insulted me publicly", "504"),
    ("Deliberate provocation", "504"),
    
    # IPC 509 - Word/Gesture to Insult Modesty
    ("Passed vulgar comments", "509"),
    ("Made obscene gestures", "509"),
]

def train_model():
    """Train the ML model with training data"""
    global model, vectorizer, sections_map
    
    print("🔧 Training ML model...")
    
    # Extract texts and labels
    texts = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]
    
    # Preprocess if available
    if preprocessor:
        texts = [preprocessor.preprocess(text) for text in texts]
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 2),
        min_df=1
    )
    
    # Transform texts to TF-IDF features
    X = vectorizer.fit_transform(texts)
    y = np.array(labels)
    
    # Train Multinomial Naive Bayes
    model = MultinomialNB(alpha=0.1)
    model.fit(X, y)
    
    # Create sections map
    for text, section in TRAINING_DATA:
        sections_map[section] = sections_map.get(section, 0) + 1
    
    print(f"✅ Model trained with {len(TRAINING_DATA)} samples")
    print(f"📊 Sections: {list(set(labels))}")
    
    # Save model
    save_model()

def save_model():
    """Save trained model and vectorizer"""
    try:
        joblib.dump(model, 'model.pkl')
        joblib.dump(vectorizer, 'vectorizer.pkl')
        print("💾 Model saved to model.pkl and vectorizer.pkl")
    except Exception as e:
        print(f"⚠️  Could not save model: {e}")

def load_model():
    """Load pre-trained model if available"""
    global model, vectorizer
    
    try:
        if os.path.exists('model.pkl') and os.path.exists('vectorizer.pkl'):
            model = joblib.load('model.pkl')
            vectorizer = joblib.load('vectorizer.pkl')
            print("✅ Loaded pre-trained model")
            return True
    except Exception as e:
        print(f"⚠️  Could not load model: {e}")
    
    return False

# Keyword-based fallback rules
KEYWORD_RULES = {
    "323": ["hit", "punch", "beat", "slap", "assault", "attack", "physically"],
    "379": ["stole", "stolen", "theft", "robbed", "took", "property"],
    "420": ["cheat", "fraud", "deceive", "scam", "fake", "dishonest", "not delivered"],
    "506": ["threat", "threaten", "intimidate", "kill", "harm", "danger"],
    "354": ["molest", "inappropriate", "touch", "harassment", "modesty"],
    "376": ["rape", "sexual assault", "sexual violence"],
    "302": ["murder", "killed", "homicide", "dead"],
    "406": ["breach of trust", "misappropriate", "entrust"],
    "498A": ["dowry", "husband", "in-laws", "domestic violence", "torture"],
    "392": ["robbery", "dacoity", "gunpoint", "armed"],
    "66D": ["cyber", "hacking", "phishing", "online fraud", "credit card fraud"],
}

def keyword_based_prediction(text):
    """Fallback: Rule-based keyword matching"""
    text_lower = text.lower()
    
    scores = {}
    for section, keywords in KEYWORD_RULES.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            scores[section] = score
    
    if scores:
        best_section = max(scores, key=scores.get)
        confidence = min(scores[best_section] / 3, 0.85)  # Cap at 0.85 for keyword-based
        return best_section, confidence
    
    return None, 0.0

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "service": "Legal ML Service",
        "model_loaded": model is not None,
        "nlp_loaded": nlp is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict IPC section from text
    
    Request: { "text": "Someone stole my phone" }
    Response: { "section": "379", "confidence": 0.87, "method": "ml" }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                "error": "Missing 'text' field in request"
            }), 400
        
        text = data['text'].strip()
        
        if len(text) < 5:
            return jsonify({
                "error": "Text too short. Please provide more details."
            }), 400
        
        # Try ML prediction first
        ml_section = None
        ml_confidence = 0.0
        
        if model and vectorizer:
            # Preprocess text
            processed_text = preprocessor.preprocess(text) if preprocessor else text.lower()
            
            # Transform to TF-IDF
            X = vectorizer.transform([processed_text])
            
            # Predict
            ml_section = model.predict(X)[0]
            
            # Get probability/confidence
            probabilities = model.predict_proba(X)[0]
            ml_confidence = float(max(probabilities))
        
        # Keyword-based fallback
        keyword_section, keyword_confidence = keyword_based_prediction(text)
        
        # Hybrid decision
        if ml_confidence >= 0.6:
            # Use ML prediction
            return jsonify({
                "section": ml_section,
                "confidence": round(ml_confidence, 2),
                "method": "ml",
                "original_text": text
            })
        elif keyword_section:
            # Use keyword-based prediction
            return jsonify({
                "section": keyword_section,
                "confidence": round(keyword_confidence, 2),
                "method": "keyword",
                "original_text": text
            })
        else:
            # No confident prediction
            return jsonify({
                "section": None,
                "confidence": 0.0,
                "method": "none",
                "message": "Could not confidently predict section. Please provide more details.",
                "original_text": text
            })
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    """Retrain the model (admin endpoint)"""
    try:
        train_model()
        return jsonify({
            "message": "Model retrained successfully",
            "samples": len(TRAINING_DATA)
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/sections', methods=['GET'])
def get_sections():
    """Get list of supported sections"""
    unique_sections = list(set([item[1] for item in TRAINING_DATA]))
    return jsonify({
        "sections": sorted(unique_sections),
        "total": len(unique_sections)
    })

if __name__ == '__main__':
    print("🚀 Starting Legal ML Service...")
    
    # Try to load existing model, otherwise train new one
    if not load_model():
        train_model()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
