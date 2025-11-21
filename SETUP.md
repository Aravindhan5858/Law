# Legal Case Advisor – Complete Setup Guide

## Project Overview

**Legal Case Advisor** is an intelligent law identification and guidance system that uses:
- **NLP**: spaCy for text preprocessing
- **Machine Learning**: TF-IDF + Naive Bayes for IPC section prediction
- **Hybrid Approach**: ML prediction with keyword-based fallback
- **Voice Input**: Web Speech API for voice-to-text
- **Full Stack**: React + Express + Flask microservices

---

## Architecture

```
┌─────────────────┐
│   React Frontend│ (Port 5176)
│   - Voice Input │
│   - Text Input  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Express Backend │ (Port 4000)
│ - API Routes    │
│ - Integration   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Flask ML Service│ (Port 5001)
│ - NLP (spaCy)   │
│ - TF-IDF        │
│ - Naive Bayes   │
└─────────────────┘
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Git**

---

## Installation Steps

### 1. Clone Repository

```bash
cd /home/aravind/codebase/Law
```

### 2. Setup Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Install axios for ML service integration
npm install axios

# Create .env file
cat > .env << EOF
PORT=4000
ML_SERVICE_URL=http://localhost:5001
EOF

# Start backend
npm run dev
```

Backend runs on: `http://localhost:4000`

### 3. Setup ML Service (Python Flask)

```bash
cd ml_service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start ML service
python app.py
```

Or use the automated setup script:

```bash
cd ml_service
chmod +x setup.sh
./setup.sh
python app.py
```

ML Service runs on: `http://localhost:5001`

### 4. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:4000
EOF

# Start frontend
npm run dev
```

Frontend runs on: `http://localhost:5176`

---

## Verify Installation

### 1. Check Backend

```bash
curl http://localhost:4000/health
# Expected: {"status":"ok"}
```

### 2. Check ML Service

```bash
curl http://localhost:5001/health
# Expected: {"status":"ok","service":"Legal ML Service","model_loaded":true}
```

### 3. Test ML Prediction

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my phone"}'
# Expected: {"section":"379","confidence":0.87,"method":"ml"}
```

### 4. Test Full Flow

```bash
curl -X POST http://localhost:4000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "He threatened to kill me"}'
# Expected: Full analysis with Section 506 details
```

### 5. Open Frontend

Open browser and go to: `http://localhost:5176`

- Test text input
- Test voice input (Chrome/Edge/Safari only)
- Test example complaint
- Verify analysis results display

---

## Project Structure

```
Law/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   └── AnalyzePage.tsx    # Main page with voice input
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express.js + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   │   └── analyze.ts         # Integrates ML service
│   │   ├── services/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── data/
│   │   └── ipc_sections.json      # 20+ IPC sections dataset
│   ├── package.json
│   └── tsconfig.json
│
├── ml_service/            # Python Flask ML microservice
│   ├── app.py             # Flask app with NLP + ML
│   ├── requirements.txt   # Python dependencies
│   ├── setup.sh           # Automated setup
│   ├── model.pkl          # Trained model (generated)
│   ├── vectorizer.pkl     # TF-IDF vectorizer (generated)
│   └── README.md
│
├── SETUP.md               # This file
└── README.md              # Project documentation
```

---

## Features

### 1. NLP Preprocessing
- **spaCy** for lemmatization
- Stopword removal
- Text normalization

### 2. Machine Learning
- **TF-IDF** vectorization (1-2 grams)
- **Multinomial Naive Bayes** classifier
- Training on 60+ examples across 15 IPC sections

### 3. Hybrid Prediction
- ML prediction (confidence ≥ 0.6)
- Keyword-based fallback (confidence < 0.6)
- No prediction if neither works

### 4. Voice Input
- Web Speech API integration
- Supports English (can be extended to Tamil/Hindi)
- Real-time speech-to-text

### 5. Comprehensive Analysis
- IPC section identification
- Punishment details
- Legal procedure steps
- Case classification
- Expected outcomes

---

## Supported IPC Sections

Currently trained on 15+ sections:
- **302**: Murder
- **304**: Culpable Homicide
- **323**: Assault (Hurt)
- **325**: Grievous Hurt
- **354**: Assault on Woman
- **376**: Rape
- **379**: Theft
- **392**: Robbery
- **406**: Breach of Trust
- **420**: Cheating/Fraud
- **467**: Forgery
- **498A**: Dowry Harassment
- **504**: Intentional Insult
- **506**: Criminal Intimidation
- **509**: Insult to Woman's Modesty
- **66D**: Cyber Fraud (IT Act)
- **66E**: Privacy Violation (IT Act)

---

## Testing

### Test Cases

1. **Assault**: "He hit me in the street"
   - Expected: Section 323

2. **Theft**: "Someone stole my bag"
   - Expected: Section 379

3. **Fraud**: "He cheated me online"
   - Expected: Section 420 or 66D

4. **Threat**: "He threatened to kill me"
   - Expected: Section 506

5. **Dowry**: "My husband harasses me for dowry"
   - Expected: Section 498A

### Voice Input Testing

1. Click "🎤 Voice Input" button
2. Allow microphone permission
3. Speak clearly: "Someone stole my phone from my bag"
4. Wait for transcription
5. Click "Analyze Case"
6. Verify Section 379 appears

---

## Troubleshooting

### ML Service Not Starting

```bash
# Check Python version
python3 --version  # Should be 3.8+

# Reinstall dependencies
cd ml_service
pip install --upgrade -r requirements.txt

# Download spaCy model again
python -m spacy download en_core_web_sm
```

### Backend Can't Connect to ML Service

```bash
# Verify ML service is running
curl http://localhost:5001/health

# Check backend .env file
cat backend/.env
# Should have: ML_SERVICE_URL=http://localhost:5001

# Restart backend
cd backend
npm run dev
```

### Voice Input Not Working

- **Chrome/Edge/Safari only**: Firefox doesn't support Web Speech API well
- **HTTPS required in production**: HTTP works for localhost only
- **Check microphone permission**: Browser should prompt for permission
- **Check browser console**: Look for errors

### No Analysis Results

```bash
# Check all services are running
ps aux | grep node     # Backend should be running
ps aux | grep python   # ML service should be running

# Check logs
# Backend: Check terminal for errors
# ML service: Check terminal for prediction logs
# Frontend: Check browser console
```

---

## Development

### Adding New IPC Sections

1. **Add training data** in `ml_service/app.py`:
```python
# In TRAINING_DATA list
{"text": "Example case description", "section": "123"}
```

2. **Add keyword rules** in `ml_service/app.py`:
```python
KEYWORD_RULES = {
    "123": ["keyword1", "keyword2", "keyword3"]
}
```

3. **Add section details** in `backend/data/ipc_sections.json`:
```json
{
  "section": "123",
  "title": "Section Title",
  "description": "Description",
  "punishment": "Punishment details",
  ...
}
```

4. **Retrain model**:
```bash
curl -X POST http://localhost:5001/retrain
```

### Improving ML Model

1. **Add more training data** (100+ samples per section recommended)
2. **Tune hyperparameters** in `app.py`:
   - TF-IDF: `max_features`, `ngram_range`
   - Naive Bayes: `alpha` parameter
3. **Try different classifiers**: SVM, Random Forest, etc.
4. **Implement deep learning**: BERT, RoBERTa for better accuracy

---

## Deployment

### Backend (Node.js) - Render/Railway

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables:
   - `ML_SERVICE_URL=<ml-service-url>`
4. Deploy

### ML Service - PythonAnywhere/Hugging Face

**PythonAnywhere:**
1. Upload files
2. Create virtual environment
3. Install requirements
4. Configure WSGI
5. Start Flask app

**Hugging Face Spaces:**
1. Create Space (Gradio/Flask)
2. Upload code
3. Add requirements.txt
4. Deploy

### Frontend - Vercel/Netlify

1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set environment variable: `VITE_API_URL=<backend-url>`
5. Deploy

---

## API Documentation

### Backend API

#### POST /api/analyze
Analyze legal complaint and get IPC section prediction

**Request:**
```json
{
  "text": "Someone stole my phone"
}
```

**Response:**
```json
{
  "query": "Someone stole my phone",
  "confidence": 0.87,
  "method": "ml",
  "recommendations": [{
    "section": "379",
    "title": "Punishment for Theft",
    "description": "...",
    "punishment": "...",
    "procedure": [...],
    "examples": [...]
  }],
  "disclaimer": "..."
}
```

### ML Service API

#### POST /predict
Predict IPC section from complaint text

**Request:**
```json
{
  "text": "He threatened to kill me"
}
```

**Response:**
```json
{
  "section": "506",
  "confidence": 0.92,
  "method": "ml",
  "original_text": "He threatened to kill me"
}
```

#### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "service": "Legal ML Service",
  "model_loaded": true,
  "nlp_loaded": true
}
```

#### GET /sections
Get list of supported IPC sections

**Response:**
```json
{
  "sections": ["302", "323", "379", ...],
  "total": 15
}
```

---

## License

MIT License

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

---

## Support

For issues or questions:
1. Check this SETUP.md
2. Review ml_service/README.md
3. Check backend/src/routes/analyze.ts
4. Review frontend/src/pages/AnalyzePage.tsx

---

## Future Enhancements

1. **Multilingual Support**: Tamil, Hindi, regional languages
2. **Deep Learning**: BERT/RoBERTa for better accuracy
3. **Document Upload**: PDF analysis of legal documents
4. **Chat Interface**: Conversational legal advisor
5. **Case History**: Save and track user cases
6. **Lawyer Recommendations**: Connect with lawyers
7. **Court Locator**: Find nearest courts
8. **Legal Templates**: Generate legal documents

---

## Acknowledgments

- **spaCy**: NLP preprocessing
- **scikit-learn**: Machine learning
- **Flask**: ML microservice
- **Express.js**: Backend API
- **React**: Frontend framework
- **Vite**: Build tool
- **Framer Motion**: Animations
