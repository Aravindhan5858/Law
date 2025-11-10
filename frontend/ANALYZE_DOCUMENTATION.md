# 📋 Analyze Function Documentation

## Overview

The **Analyze** function provides comprehensive legal case analysis using a structured prompt format that returns detailed information about complaints.

---

## 🎯 Analysis Prompt Format

The system uses this exact prompt structure for every complaint analysis:

```
Analyze the following complaint and return:

1. Case classification (criminal / consumer / cyber)
2. Applicable IPC sections or legal provisions
3. Possible punishment
4. Steps to solve the problem legally
5. Final output in clear points, responsive layout

Complaint:
[User's complaint text here]

Expected analysis format:
- Case type
- IPC / IT Act / Consumer Act sections
- Punishment details
- How to file a complaint (consumer court, cyber crime portal, police FIR)
- Probable outcome
```

---

## 📝 Example Complaint

**Pre-loaded Example:**
```
A customer pays for a mobile phone on an e-commerce website. 
The product is never delivered. The site stops responding 
and no refund is provided.
```

---

## 🔍 Analysis Output Format

The result page displays the following sections in a responsive layout:

### 1. **Your Complaint**
- Displays the original complaint text
- Highlighted in a special section for easy reference

### 2. **Case Classification** 🔍
Automatically classifies the case into one of three categories:
- **Criminal Case** (Red badge)
- **Consumer Complaint** (Green badge)  
- **Cyber Crime** (Purple badge)

### 3. **Applicable Legal Provisions** ⚖️
Shows:
- **Primary Section**: Main IPC/IT Act/Consumer Act section
- **Section Number & Title**
- **Confidence Score** (e.g., 85% Match)
- **Rationale**: Why this section applies
- **Additional Sections**: Other relevant legal provisions (if any)

### 4. **Possible Punishment** ⚡
Details:
- Penalty amounts
- Imprisonment duration
- Fine details
- Other consequences

### 5. **How to File a Complaint** 📋

#### Step-by-Step Procedure:
Numbered steps showing the complete process to file the complaint

#### Filing Options (with direct links):

**🏛️ Consumer Court**
- For consumer-related disputes and e-commerce fraud
- Link: https://edaakhil.nic.in/edaakhil/

**💻 Cyber Crime Portal**
- For online fraud, cyber crimes, and digital offenses
- Link: https://cybercrime.gov.in/

**🚔 Police FIR**
- For criminal cases requiring police investigation
- Link: https://www.india.gov.in/topics/law-justice/police

### 6. **Probable Outcome** 🎯

#### For the Complainant:
- ✅ Refund of the paid amount
- ✅ Compensation for mental agony and harassment
- ✅ Interest on the amount from the date of payment
- ✅ Legal costs may be recovered

#### For the Accused:
- ⚠️ Penalty as per applicable sections
- ⚠️ Obligation to refund the customer
- ⚠️ Possible business license implications
- ⚠️ Criminal liability if fraud is proven

---

## 🎨 UI Features

### Analyze Page
- **Large text area** for detailed complaint entry
- **Character counter** showing input length
- **Load Example button** to quickly test with sample complaint
- **Information panel** explaining what analysis will provide
- **Submit button** with loading state and validation
- **Feature cards** explaining the 4 key analysis components

### Result Page
- **Responsive card layout** for all sections
- **Color-coded badges** for case types
- **Confidence scores** for legal sections
- **Expandable details** for additional information
- **Direct action links** to filing portals
- **Navigation buttons** (Back / Analyze New Case)
- **Disclaimer section** with important legal notice

---

## 🎯 Key Features

### 1. **Comprehensive Analysis**
- Identifies case type automatically
- Provides multiple applicable legal sections
- Ranks sections by relevance/confidence

### 2. **Actionable Guidance**
- Step-by-step filing procedure
- Direct links to official portals
- Clear timeline and expected outcomes

### 3. **User-Friendly Design**
- Clean, modern interface
- Mobile-responsive layout
- Easy-to-read formatting
- Visual indicators (icons, badges, colors)

### 4. **Example Driven**
- Pre-loaded example for quick testing
- Clear placeholder text
- Character count validation

---

## 📱 Responsive Design

The analysis pages are fully responsive:

### Desktop (> 1024px)
- Multi-column grid layout
- Wide text areas
- Side-by-side comparisons
- Full feature cards

### Tablet (768px - 1024px)
- 2-column grid
- Adjusted padding
- Stacked sections

### Mobile (< 768px)
- Single column layout
- Full-width elements
- Touch-friendly buttons
- Optimized spacing

---

## 🔄 User Flow

```
1. User visits /analyze page
   ↓
2. User enters complaint (or loads example)
   ↓
3. User clicks "Analyze Case" button
   ↓
4. System sends prompt to backend API
   ↓
5. Backend processes and returns analysis
   ↓
6. User redirected to /result page
   ↓
7. Result displays all 6 sections:
   - Original complaint
   - Case classification
   - Legal provisions
   - Punishment details
   - Filing steps & links
   - Probable outcomes
   ↓
8. User can:
   - Go back to edit
   - Analyze new case
   - Click filing portal links
```

---

## 🛠️ Technical Implementation

### Frontend Components

**AnalyzePage.tsx**
```typescript
- State: text, loading
- Example complaint constant
- Submit function with validation
- Prompt construction
- API call to /api/laws/analyze
- Navigation with state
```

**ResultPage.tsx**
```typescript
- Receives result from navigation state
- Displays 6 main sections
- Conditional rendering based on case type
- Multiple legal sections support
- Filing options with external links
- Action buttons
```

### Styling (styles.css)

New classes added:
- `.page-container`, `.content-wrapper`
- `.analyze-card`, `.analyze-header`
- `.complaint-textarea`, `.char-count`
- `.result-section`, `.classification-badge`
- `.legal-card`, `.punishment-card`
- `.procedure-card`, `.filing-options`
- `.outcome-card`, `.disclaimer-card`
- Responsive media queries

---

## 🚀 API Integration

### Request Format
```typescript
POST /api/laws/analyze

Body:
{
  "text": "Analyze the following complaint and return:\n\n1. Case classification...\n\nComplaint:\n[user complaint]\n\nExpected analysis format:..."
}
```

### Response Format
```typescript
{
  "query": "Full prompt sent",
  "recommendations": [
    {
      "ipc_section": "420",
      "title": "Cheating and dishonestly inducing delivery of property",
      "punishment": "Imprisonment up to 7 years and fine",
      "confidence": 0.85,
      "rationale": "Applicable because...",
      "procedure": "Step 1. ... Step 2. ..."
    }
  ],
  "disclaimer": "This tool provides informational suggestions only..."
}
```

---

## ✅ Validation Rules

### Input Validation
- Minimum 10 characters required
- Trims whitespace
- Alert shown if too short

### Output Validation
- Checks if result exists
- Handles empty recommendations
- Shows fallback UI for no matches

---

## 🎨 Visual Design Elements

### Color Coding
- **Criminal**: Red (#dc2626)
- **Consumer**: Green (#10b981)
- **Cyber**: Purple (#6366f1)
- **Info**: Blue (#2563eb)
- **Warning**: Orange (#f59e0b)

### Icons
- 🔍 Classification
- ⚖️ Legal provisions
- ⚡ Punishment
- 📋 Procedure
- 🎯 Outcome
- 🏛️ Consumer court
- 💻 Cyber portal
- 🚔 Police FIR

### Badges & Tags
- Case type badges
- Confidence scores
- Step numbers
- Section highlights

---

## 📊 Expected Output Example

For the e-commerce complaint:

**Case Type:** Consumer Complaint / Cyber Crime

**Legal Sections:**
- Consumer Protection Act, 2019
- Section 66D of IT Act (Cheating by personation using computer)
- IPC Section 420 (Cheating)

**Punishment:**
- Imprisonment up to 3 years
- Fine up to ₹1,00,000
- Compensation to victim

**Filing Steps:**
1. Gather all evidence (payment receipts, screenshots, emails)
2. File complaint on National Consumer Helpline
3. Register cyber crime complaint
4. File case in consumer court
5. Await hearing and judgment

**Outcome:**
- Full refund likely
- Compensation for harassment
- Interest on delayed payment
- Costs recovered

---

## 🔗 Quick Links

- **Analyze Page**: http://localhost:5173/analyze
- **Consumer Forum**: https://edaakhil.nic.in/edaakhil/
- **Cyber Crime Portal**: https://cybercrime.gov.in/
- **Police Portal**: https://www.india.gov.in/topics/law-justice/police

---

## 📝 Notes

- All analysis is AI/rule-based and **not legal advice**
- Users should consult qualified lawyers for actual cases
- Disclaimer is shown on every result page
- External links open in new tabs
- Results can be navigated back to edit

---

**Status:** ✅ Fully Implemented  
**Version:** 1.0.0  
**Last Updated:** November 10, 2025
