# Testing Guide - Legal Case Advisor

## 🧪 Complete Testing Checklist

This document provides comprehensive testing procedures for the Legal Case Advisor system.

---

## ✅ Pre-Testing Setup

### 1. Verify All Services Are Running

```bash
# Check ML Service
curl http://localhost:5001/health
# Expected: {"status":"ok","service":"Legal ML Service","model_loaded":true,"nlp_loaded":true}

# Check Backend
curl http://localhost:4000/health  
# Expected: {"status":"ok"} or similar

# Check Frontend
curl http://localhost:5176
# Expected: HTML content
```

### 2. Check Logs

```bash
# Open 3 terminals to monitor logs
tail -f logs/ml_service.log
tail -f logs/backend.log  
tail -f logs/frontend.log
```

---

## 🤖 ML Service Testing

### Test 1: Health Check

```bash
curl http://localhost:5001/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "service": "Legal ML Service",
  "model_loaded": true,
  "nlp_loaded": true
}
```

### Test 2: Get Supported Sections

```bash
curl http://localhost:5001/sections
```

**Expected Response**:
```json
{
  "sections": ["302", "304", "323", "354", "376", "379", "392", "406", "420", "467", "498A", "504", "506", "509", "66D"],
  "total": 15
}
```

### Test 3: Predict Theft (Section 379)

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my mobile phone from my bag"}'
```

**Expected Response**:
```json
{
  "section": "379",
  "confidence": 0.87,
  "method": "ml",
  "original_text": "Someone stole my mobile phone from my bag"
}
```

✅ **Pass Criteria**: 
- Section is "379"
- Confidence ≥ 0.6
- Method is "ml"

### Test 4: Predict Assault (Section 323)

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He hit me in the street and caused injury"}'
```

**Expected Response**:
```json
{
  "section": "323",
  "confidence": 0.78,
  "method": "ml"
}
```

✅ **Pass Criteria**: Section is "323", confidence ≥ 0.6

### Test 5: Predict Cheating (Section 420)

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He cheated me online and took my money"}'
```

**Expected Response**:
```json
{
  "section": "420",
  "confidence": 0.72,
  "method": "ml"
}
```

✅ **Pass Criteria**: Section is "420", confidence ≥ 0.6

### Test 6: Predict Threat (Section 506)

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "He threatened to kill me if I dont pay"}'
```

**Expected Response**:
```json
{
  "section": "506",
  "confidence": 0.91,
  "method": "ml"
}
```

✅ **Pass Criteria**: Section is "506", confidence ≥ 0.6

### Test 7: Predict Dowry Harassment (Section 498A)

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "My husband and in-laws torture me for dowry"}'
```

**Expected Response**:
```json
{
  "section": "498A",
  "confidence": 0.85,
  "method": "ml"
}
```

✅ **Pass Criteria**: Section is "498A", confidence ≥ 0.6

### Test 8: Keyword Fallback

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "xyz abc random words theft bag"}'
```

**Expected Response**:
```json
{
  "section": "379",
  "confidence": 0.85,
  "method": "keyword"
}
```

✅ **Pass Criteria**: 
- Section is "379" (keyword: theft)
- Method is "keyword"
- Confidence ≤ 0.85

### Test 9: No Prediction

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "hello how are you"}'
```

**Expected Response**:
```json
{
  "section": null,
  "confidence": 0,
  "method": "none",
  "original_text": "hello how are you"
}
```

✅ **Pass Criteria**: 
- Section is null
- Confidence is 0
- Method is "none"

---

## 🔧 Backend Testing

### Test 10: Backend Analyze (with ML Integration)

```bash
curl -X POST http://localhost:4000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my phone"}'
```

**Expected Response**:
```json
{
  "query": "Someone stole my phone",
  "confidence": 0.87,
  "method": "ml",
  "recommendations": [{
    "section": "379",
    "title": "Punishment for Theft",
    "description": "Whoever commits theft shall be punished with imprisonment up to 3 years, or with fine, or both.",
    "punishment": "Imprisonment up to 3 years or Fine or Both",
    "case_type": "Criminal",
    "bailable": true,
    "cognizable": true,
    "procedure": [
      "Report theft to police immediately",
      "Provide list of stolen items",
      "Submit proof of ownership",
      "File FIR with details",
      "Cooperate in investigation",
      "Trial in Magistrate Court"
    ],
    "examples": [
      "Stealing personal property",
      "Theft of money or valuables",
      "Shoplifting",
      "Pickpocketing"
    ],
    "keywords": ["theft", "steal", "stole", "stolen", "robbed", "took", "pickpocket"]
  }],
  "disclaimer": "This tool provides informational suggestions only and is not legal advice. Please consult a qualified lawyer for accurate legal guidance."
}
```

✅ **Pass Criteria**:
- Has query, confidence, method
- Recommendations array has section details
- Procedure array is not empty
- Examples array is not empty

### Test 11: Backend with Invalid Input

```bash
curl -X POST http://localhost:4000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "ab"}'
```

**Expected Response**:
```json
{
  "error": "Please provide a longer description of your legal issue"
}
```

✅ **Pass Criteria**: Returns error for short input (< 3 chars)

### Test 12: Backend Fallback (ML Service Down)

**Steps**:
1. Stop ML service: `kill $(lsof -ti:5001)`
2. Send request:

```bash
curl -X POST http://localhost:4000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my bag"}'
```

**Expected Response**:
```json
{
  "query": "Someone stole my bag",
  "confidence": 0.65,
  "method": "keyword-fallback",
  "recommendations": [{
    "section": "379",
    ...
  }],
  "disclaimer": "..."
}
```

✅ **Pass Criteria**: 
- Still returns results
- Method is "keyword-fallback"
- Section is correct based on keywords

**Cleanup**: Restart ML service

---

## 🌐 Frontend Testing

### Test 13: Load Frontend

**Steps**:
1. Open browser: http://localhost:5176
2. Navigate to "Analyze" page

✅ **Pass Criteria**:
- Page loads without errors
- Header displays correctly
- Input textarea is visible
- "Load Example" button visible
- "🎤 Voice Input" button visible
- "Analyze Case" button visible

### Test 14: Text Input Analysis

**Steps**:
1. Open http://localhost:5176
2. Type in textarea: "Someone stole my phone"
3. Click "Analyze Case"
4. Wait for results

✅ **Pass Criteria**:
- Loading spinner shows
- Results appear after ~1 second
- Section 379 details displayed
- Punishment shows
- Procedure steps listed
- Examples shown
- No errors in browser console

### Test 15: Load Example

**Steps**:
1. Click "Load Example" button
2. Verify example text loads
3. Click "Analyze Case"

✅ **Pass Criteria**:
- Example text appears in textarea
- Analysis completes successfully
- Results display correctly

### Test 16: Voice Input (Chrome/Edge/Safari)

**Steps**:
1. Click "🎤 Voice Input" button
2. Allow microphone permission when prompted
3. Speak clearly: "Someone stole my bag"
4. Wait for transcription
5. Verify text appears
6. Click "Analyze Case"

✅ **Pass Criteria**:
- Button changes to "Listening..." with red color
- Microphone icon pulses
- Spoken words appear in textarea
- Analysis works on transcribed text
- Section 379 results appear

### Test 17: Voice Input Error Handling

**Steps**:
1. Click "🎤 Voice Input"
2. Deny microphone permission
3. Check error message

✅ **Pass Criteria**:
- Error message appears
- Says "Microphone permission denied"
- Button returns to normal state

### Test 18: Multiple Inputs

**Steps**:
1. Test: "He hit me" → Expect Section 323
2. Clear and test: "Threatened to kill" → Expect Section 506
3. Clear and test: "Online fraud" → Expect Section 420 or 66D
4. Clear and test: "Dowry harassment" → Expect Section 498A

✅ **Pass Criteria**: Each prediction is correct

---

## 📊 Test Case Matrix

| Test ID | Input | Expected Section | Expected Method | Min Confidence |
|---------|-------|------------------|-----------------|----------------|
| TC-01 | "Someone stole my phone" | 379 | ml | 0.60 |
| TC-02 | "He hit me in the street" | 323 | ml | 0.60 |
| TC-03 | "He cheated me online" | 420 or 66D | ml | 0.60 |
| TC-04 | "Threatened to kill me" | 506 | ml | 0.60 |
| TC-05 | "Husband tortures for dowry" | 498A | ml | 0.60 |
| TC-06 | "Molested by stranger" | 354 | ml | 0.60 |
| TC-07 | "Raped by known person" | 376 | ml | 0.60 |
| TC-08 | "Murdered my friend" | 302 | ml | 0.60 |
| TC-09 | "Robbed at gunpoint" | 392 | ml | 0.60 |
| TC-10 | "Agent misused my funds" | 406 | ml | 0.60 |
| TC-11 | "Forged my signature" | 467 | ml | 0.60 |
| TC-12 | "Insulted my wife publicly" | 509 | ml | 0.60 |
| TC-13 | "Abused me publicly" | 504 | ml | 0.60 |
| TC-14 | "Random words with theft" | 379 | keyword | ≤ 0.85 |
| TC-15 | "Hello how are you" | null | none | 0 |

---

## 🔄 Integration Testing

### Test 19: End-to-End Flow

**Steps**:
1. User enters: "My husband beats me and demands dowry"
2. Frontend → Backend → ML Service → Backend → Frontend
3. Verify complete flow

**Check**:
- ML Service logs show prediction request
- Backend logs show ML service call
- Frontend displays Section 498A details

✅ **Pass Criteria**: Complete flow works without errors

### Test 20: Concurrent Requests

**Steps**:
```bash
# Send 5 requests in parallel
for i in {1..5}; do
  curl -X POST http://localhost:5001/predict \
    -H "Content-Type: application/json" \
    -d '{"text": "Someone stole my bag"}' &
done
wait
```

✅ **Pass Criteria**: All 5 requests return correct predictions

---

## 🐛 Error Testing

### Test 21: Invalid JSON

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

✅ **Pass Criteria**: Returns 400 error with message

### Test 22: Missing Text Field

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{}'
```

✅ **Pass Criteria**: Returns 400 error "Missing text field"

### Test 23: Empty Text

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'
```

✅ **Pass Criteria**: Returns 400 error

---

## 📈 Performance Testing

### Test 24: Response Time

```bash
time curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Someone stole my phone"}'
```

✅ **Pass Criteria**: Total time < 500ms

### Test 25: Memory Usage

```bash
ps aux | grep python | grep app.py
```

✅ **Pass Criteria**: Memory < 500MB

---

## ✅ Test Summary Report

After completing all tests, fill this summary:

```
Total Tests: 25
Passed: ___
Failed: ___
Success Rate: ___%

Failed Tests (if any):
- Test ID: ___
  Reason: ___________
  
- Test ID: ___
  Reason: ___________
```

---

## 🔧 Troubleshooting Test Failures

### ML Service Not Responding
- Check: `ps aux | grep python`
- Restart: `cd ml_service && source venv/bin/activate && python app.py`
- Check logs: `tail -f logs/ml_service.log`

### Backend Errors
- Check: `ps aux | grep node`
- Restart: `cd backend && npm run dev`
- Check logs: `tail -f logs/backend.log`

### Frontend Not Loading
- Check: `curl http://localhost:5176`
- Restart: `cd frontend && npm run dev`
- Clear browser cache
- Check browser console

### Low ML Confidence
- Add more training data in `ml_service/app.py`
- Retrain model: `curl -X POST http://localhost:5001/retrain`
- Check if input matches training examples

---

## 📝 Notes

- Run tests in order for best results
- Some tests depend on previous tests passing
- Voice input tests require Chrome/Edge/Safari
- Voice input requires HTTPS in production (HTTP works for localhost)
- Check browser console for frontend errors
- Check terminal for backend/ML service errors

---

## ✅ Sign-off

```
Tested by: _______________
Date: _______________
Environment: Development / Staging / Production
All Critical Tests Passed: Yes / No
Notes: _______________________________
```
