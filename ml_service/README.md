# Legal ML Service

Python Flask microservice for IPC section prediction using NLP and Machine Learning.

## Features

- **NLP Preprocessing**: spaCy-based text preprocessing (lemmatization, stopword removal)
- **ML Model**: TF-IDF + Multinomial Naive Bayes classifier
- **Hybrid Prediction**: ML + keyword-based fallback
- **Confidence Scoring**: Returns confidence score for predictions
- **API Endpoints**: RESTful API for integration

## Setup

### 1. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

Or use the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Run the Service

```bash
python app.py
```

Service runs on: `http://localhost:5001`

## API Endpoints

### 1. Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "Legal ML Service",
  "model_loaded": true,
  "nlp_loaded": true
}
```

### 2. Predict IPC Section

```bash
POST /predict
Content-Type: application/json

{
  "text": "Someone stole my phone"
}
```

Response:
```json
{
  "section": "379",
  "confidence": 0.87,
  "method": "ml",
  "original_text": "Someone stole my phone"
}
```

### 3. Get Supported Sections

```bash
GET /sections
```

Response:
```json
{
  "sections": ["302", "323", "354", "376", "379", "392", "406", "420", "467", "498A", "504", "506", "509", "66D"],
  "total": 14
}
```

### 4. Retrain Model

```bash
POST /retrain
```

## Prediction Methods

### ML-Based (Confidence ≥ 0.6)
- Uses TF-IDF vectorization
- Multinomial Naive Bayes classifier
- Preprocessed with spaCy (lemmatization, stopword removal)

### Keyword-Based Fallback (Confidence < 0.6)
- Rule-based keyword matching
- Used when ML confidence is low
- Returns confidence capped at 0.85

### No Prediction (Confidence < threshold)
- Returns null section
- Asks user for more details

## Training Data

Current dataset includes ~40 samples for 14 IPC sections:

- **323**: Assault
- **379**: Theft
- **420**: Cheating
- **506**: Criminal Intimidation
- **354**: Assault on Woman
- **376**: Rape
- **302**: Murder
- **406**: Criminal Breach of Trust
- **498A**: Cruelty by Husband
- **392**: Robbery
- **467**: Forgery
- **66D**: Cyber Fraud (IT Act)
- **504**: Intentional Insult
- **509**: Insult to Modesty

## Model Files

After first run, the service saves:
- `model.pkl`: Trained Naive Bayes model
- `vectorizer.pkl`: TF-IDF vectorizer

These are automatically loaded on subsequent runs.

## Testing

### Test Cases

```bash
# Assault
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He hit me in the street"}'
# Expected: Section 323

# Theft
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my bag"}'
# Expected: Section 379

# Cheating
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He cheated me online"}'
# Expected: Section 420

# Threat
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He threatened to kill me"}'
# Expected: Section 506
```

## Deployment

### PythonAnywhere

1. Upload files to PythonAnywhere
2. Create virtual environment
3. Install requirements
4. Configure WSGI file
5. Set as Flask app

### Hugging Face Spaces

1. Create new Space (Gradio/Flask)
2. Upload code
3. Add requirements.txt
4. Deploy

### Railway/Render

1. Connect GitHub repo
2. Add requirements.txt
3. Set start command: `gunicorn app:app -b 0.0.0.0:5001`
4. Deploy

## Integration with Backend

Node.js backend calls this service:

```javascript
const response = await axios.post('http://localhost:5001/predict', {
  text: userInput
});

const { section, confidence, method } = response.data;
```

## Future Improvements

1. Add more training data (100+ samples per section)
2. Implement deep learning (BERT, RoBERTa)
3. Support multilingual input (Tamil, Hindi)
4. Add entity recognition for names, places, dates
5. Implement active learning for model improvement

## License

MIT License
