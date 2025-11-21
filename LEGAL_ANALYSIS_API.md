# Legal Analysis API Documentation

## Overview
The Legal Analysis API provides structured legal analysis for complaints, identifying applicable laws, punishment details, recommended actions, and expected outcomes.

---

## Base URL
```
http://localhost:4000/api/legal-analysis
```

---

## Endpoints

### 1. Analyze Complaint
Analyzes a complaint and provides comprehensive legal guidance.

**Endpoint:** `POST /analyze`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "complaint": "Your detailed complaint text here"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given."
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "complaint": "A customer pays for a mobile phone on an e-commerce site...",
  "analysis": {
    "caseClassification": {
      "primaryCategory": "E-Commerce Fraud",
      "subcategory": "Non-Delivery of Goods & Refund Denial",
      "severity": "High",
      "jurisdiction": "Consumer Court / Cyber Crime Cell"
    },
    "applicableSections": [
      {
        "act": "Indian Penal Code, 1860",
        "section": "420",
        "title": "Cheating and dishonestly inducing delivery of property",
        "description": "Whoever cheats and thereby dishonestly induces...",
        "relevance": "Applicable when seller takes payment but intentionally..."
      }
      // ... more sections
    ],
    "punishmentDetails": {
      "criminal": "Section 420 IPC: Imprisonment up to 7 years + Fine...",
      "civil": "Consumer Protection Act: Consumer forum can order...",
      "compensation": "1. Full refund of amount paid..."
    },
    "actionSteps": [
      {
        "step": 1,
        "action": "Preserve All Evidence: Take screenshots...",
        "timeline": "Immediately",
        "authority": "Self"
      }
      // ... more steps
    ],
    "expectedOutcome": {
      "bestCase": "Full refund of paid amount + 12% annual interest...",
      "worstCase": "If seller/company has shut down...",
      "timeline": "Consumer Court: 3-12 months...",
      "successProbability": "High (75-85%) in consumer court..."
    },
    "additionalNotes": "IMPORTANT TIPS:\n\n1. EVIDENCE IS CRUCIAL..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Complaint text is required",
  "message": "Please provide complaint in request body as: { \"complaint\": \"your complaint text\" }"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Analysis failed",
  "message": "Error details here"
}
```

---

### 2. Health Check
Check if the legal analysis service is running.

**Endpoint:** `GET /health`

**Example Request:**
```bash
curl http://localhost:4000/api/legal-analysis/health
```

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "service": "Legal Analysis Service",
  "version": "1.0.0"
}
```

---

## Response Schema

### CaseClassification
```typescript
{
  primaryCategory: string;      // E.g., "E-Commerce Fraud"
  subcategory: string;           // E.g., "Non-Delivery of Goods"
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  jurisdiction: string;          // E.g., "Consumer Court"
}
```

### ApplicableSection
```typescript
{
  act: string;                   // E.g., "Indian Penal Code, 1860"
  section: string;               // E.g., "420"
  title: string;                 // Section title
  description: string;           // What the section says
  relevance: string;             // Why it applies to this case
}
```

### PunishmentDetails
```typescript
{
  criminal?: string;             // Criminal penalties
  civil?: string;                // Civil remedies
  compensation?: string;         // Compensation breakdown
}
```

### ActionStep
```typescript
{
  step: number;                  // Step number
  action: string;                // What to do
  timeline: string;              // When to do it
  authority: string;             // Who to approach
}
```

### ExpectedOutcome
```typescript
{
  bestCase: string;              // Best possible outcome
  worstCase: string;             // Worst possible outcome
  timeline: string;              // How long it might take
  successProbability: string;    // Likelihood of success
}
```

---

## Supported Case Types

Currently supports automated analysis for:

1. **E-Commerce Fraud**
   - Non-delivery of goods
   - Refund denial
   - Online shopping fraud

2. **Fraud & Cheating** (General)
   - Criminal breach of trust
   - Cheating cases

3. **Civil Disputes** (General)
   - Contract breaches
   - General civil matters

---

## Applicable Laws Database

The system has knowledge of sections from:

1. **Indian Penal Code, 1860**
   - Section 420 (Cheating)
   - Section 406 (Criminal breach of trust)
   - And more...

2. **Information Technology Act, 2000**
   - Section 66D (Cheating by personation)
   - And more...

3. **Consumer Protection Act, 2019**
   - Deficiency in service
   - Unfair trade practices
   - And more...

4. **Indian Contract Act, 1872**
   - Section 73 (Compensation for breach)
   - And more...

---

## Usage Examples

### Example 1: E-Commerce Fraud
```bash
curl -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "I ordered a laptop from an online store. Paid Rs. 50,000. Product never arrived and seller is not responding to calls or emails."
  }'
```

### Example 2: Using with jq for formatted output
```bash
curl -s -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "Your complaint here"
  }' | jq '.analysis.caseClassification'
```

### Example 3: Save to file
```bash
curl -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "Your complaint here"
  }' | jq '.' > analysis_result.json
```

---

## Testing

### Quick Test Script
Run the provided test script:
```bash
./test_legal_analysis.sh
```

This will:
1. Check backend health
2. Analyze a sample complaint
3. Display key sections of the analysis
4. Save full response to `/tmp/legal_analysis_response.json`

### Manual Testing
```bash
# 1. Check health
curl http://localhost:4000/api/legal-analysis/health

# 2. Test analysis
curl -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Test complaint text"}' | jq '.'
```

---

## Integration Guide

### Frontend Integration (React/TypeScript)

```typescript
// services/legalAnalysisAPI.ts
const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';

interface LegalAnalysisResponse {
  success: boolean;
  complaint: string;
  analysis: {
    caseClassification: CaseClassification;
    applicableSections: ApplicableSection[];
    punishmentDetails: PunishmentDetails;
    actionSteps: ActionStep[];
    expectedOutcome: ExpectedOutcome;
    additionalNotes?: string;
  };
}

export async function analyzeComplaint(
  complaint: string
): Promise<LegalAnalysisResponse> {
  const response = await fetch(`${API_URL}/api/legal-analysis/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ complaint }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
```

### Usage in Component

```typescript
import { analyzeComplaint } from './services/legalAnalysisAPI';

function AnalyzePage() {
  const [complaint, setComplaint] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeComplaint(complaint);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder="Describe your complaint..."
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {analysis && <AnalysisResults data={analysis} />}
    </div>
  );
}
```

---

## Error Handling

### Common Errors

| Status Code | Error | Solution |
|-------------|-------|----------|
| 400 | Complaint text is required | Include "complaint" field in request body |
| 400 | Complaint too short | Provide at least 10 characters |
| 500 | Analysis failed | Check server logs for details |
| 404 | Not found | Verify endpoint URL is correct |

### Best Practices

1. **Always validate input** before sending to API
2. **Handle network errors** gracefully
3. **Show loading states** during analysis
4. **Cache results** for the same complaint
5. **Implement retry logic** for failed requests

---

## Performance

- **Average Response Time:** < 100ms
- **Max Complaint Length:** No hard limit, but keep under 5000 characters for optimal performance
- **Rate Limiting:** Currently none, but recommended to implement client-side throttling

---

## Security

- API is currently open (no authentication)
- For production:
  - Add authentication/API keys
  - Implement rate limiting
  - Add input sanitization
  - Enable CORS restrictions

---

## Future Enhancements

Planned features:
1. Support for more case types (property disputes, employment, family law)
2. Multi-language support
3. PDF report generation
4. Case precedent search integration
5. Lawyer recommendation system
6. Document upload for evidence analysis

---

## Support

For issues or questions:
- Check the sample output: `LEGAL_ANALYSIS_SAMPLE.md`
- Run test script: `./test_legal_analysis.sh`
- Check backend logs for errors

---

## Version History

**v1.0.0** (Current)
- Initial release
- E-commerce fraud analysis
- General fraud & civil dispute support
- 6 applicable laws coverage
- 7-step action plan
- Comprehensive outcome prediction

---

**Last Updated:** November 11, 2025
