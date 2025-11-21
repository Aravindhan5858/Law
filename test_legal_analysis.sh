#!/bin/bash

# Legal Analysis API Test Script
# Tests the /api/legal-analysis/analyze endpoint

echo "============================================"
echo "   LEGAL ANALYSIS SYSTEM - API TEST"
echo "============================================"
echo ""

# Check if backend is running
echo "1. Checking backend health..."
HEALTH=$(curl -s http://localhost:4000/api/legal-analysis/health)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
    echo "$HEALTH" | jq '.'
else
    echo "❌ Backend is not running. Please start with: npm run dev"
    exit 1
fi

echo ""
echo "============================================"
echo ""

# Test the legal analysis endpoint
echo "2. Analyzing complaint..."
echo ""
echo "Complaint: 'A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given.'"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:4000/api/legal-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given."
  }')

echo "============================================"
echo "   CASE CLASSIFICATION"
echo "============================================"
echo "$RESPONSE" | jq -r '.analysis.caseClassification | 
  "Category: \(.primaryCategory)\nSubcategory: \(.subcategory)\nSeverity: \(.severity)\nJurisdiction: \(.jurisdiction)"'

echo ""
echo "============================================"
echo "   APPLICABLE SECTIONS (First 3)"
echo "============================================"
echo "$RESPONSE" | jq -r '.analysis.applicableSections[0:3][] | 
  "\n📚 \(.act) - Section \(.section)\n   Title: \(.title)\n   Relevance: \(.relevance)\n"'

echo ""
echo "============================================"
echo "   PUNISHMENT DETAILS"
echo "============================================"
echo "$RESPONSE" | jq -r '.analysis.punishmentDetails.criminal' | head -3

echo ""
echo "============================================"
echo "   ACTION STEPS (First 3)"
echo "============================================"
echo "$RESPONSE" | jq -r '.analysis.actionSteps[0:3][] | 
  "\nStep \(.step): \(.action)\n   Timeline: \(.timeline)\n   Authority: \(.authority)"'

echo ""
echo "============================================"
echo "   EXPECTED OUTCOME"
echo "============================================"
echo "$RESPONSE" | jq -r '.analysis.expectedOutcome | 
  "Success Probability: \(.successProbability)\n\nTimeline: \(.timeline)\n\nBest Case:\n\(.bestCase)"' | head -8

echo ""
echo "============================================"
echo "   FULL RESPONSE SAVED"
echo "============================================"
echo "$RESPONSE" | jq '.' > /tmp/legal_analysis_response.json
echo "✅ Full JSON response saved to: /tmp/legal_analysis_response.json"
echo ""
echo "View with: cat /tmp/legal_analysis_response.json | jq '.'"
echo ""
echo "============================================"
echo "   TEST COMPLETED SUCCESSFULLY"
echo "============================================"
