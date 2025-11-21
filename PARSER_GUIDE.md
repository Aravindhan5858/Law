# 📖 Bare Act Parser - Quick Start Guide

## Purpose
Convert plain text bare acts into ML-ready JSON format with 1000+ sections.

## ✅ What You Have
- **Parser Script**: `frontend/src/scripts/parseBareAct.ts`
- **Supports**: IPC, CrPC, IT Act, Evidence Act, Contract Act, Companies Act, MV Act, RTI
- **Auto-extracts**: Section numbers, titles, text, punishment, keywords, categories

---

## 🚀 How to Use

### Step 1: Get Bare Act Text Files

Download bare acts as plain text from:
- **India Code**: https://www.indiacode.nic.in/
- **Legislative Department**: https://legislative.gov.in/

Save as `.txt` files in a `bare_acts/` folder.

### Step 2: Run Parser

```bash
cd /home/aravind/codebase/Law/frontend

# Install ts-node if not already installed
npm install -g ts-node

# Parse IPC bare act
npx ts-node src/scripts/parseBareAct.ts IPC ./bare_acts/ipc.txt ./src/data/comprehensive/ipc_complete.json

# Parse CrPC
npx ts-node src/scripts/parseBareAct.ts CRPC ./bare_acts/crpc.txt ./src/data/comprehensive/crpc_complete.json

# Parse IT Act
npx ts-node src/scripts/parseBareAct.ts IT_ACT ./bare_acts/it_act.txt ./src/data/comprehensive/it_act_complete.json
```

### Available Act Keys:
- `IPC` - Indian Penal Code (1860)
- `CRPC` - Code of Criminal Procedure (1973)
- `EVIDENCE` - Indian Evidence Act (1872)
- `IT_ACT` - Information Technology Act (2000)
- `CONTRACT` - Indian Contract Act (1872)
- `COMPANIES` - Companies Act (2013)
- `MV_ACT` - Motor Vehicles Act (1988)
- `RTI` - Right to Information Act (2005)

---

## 📋 Expected Text Format

The parser expects sections in this format:

```
CHAPTER I
INTRODUCTION

Section 1. Title and extent of operation
This Act shall be called the Indian Penal Code...

Section 2. Punishment of offences committed within India
Every person shall be liable to punishment...

CHAPTER II
GENERAL EXPLANATIONS

Section 6. Definitions in the Code
Throughout this Code every definition...
```

**Or simplified:**

```
1. Title and extent of operation
This Act shall be called the Indian Penal Code...

2. Punishment of offences committed within India
Every person shall be liable to punishment...
```

---

## 📤 Output Format

The parser generates ML-ready JSON:

```json
[
  {
    "id": "IPC-378",
    "act_name": "Indian Penal Code",
    "act_year": 1860,
    "act_short_name": "IPC",
    "section_number": "378",
    "section_title": "Theft",
    "section_text": "Whoever, intending to take dishonestly...",
    "chapter": "OF OFFENCES AGAINST PROPERTY",
    "chapter_number": 17,
    "punishment": "shall be punished with imprisonment...",
    "keywords": ["theft", "dishonestly", "movable", "property", "consent"],
    "category": "Theft & Robbery",
    "searchable_text": "378 theft whoever intending take dishonestly..."
  }
]
```

---

## 🔄 Integration with Search Engine

After parsing, integrate with your backend:

### Option 1: Replace Existing Files (Simple)
```bash
# Copy parsed file to replace current data
cp ./src/data/comprehensive/ipc_complete.json ./src/data/ipc.json

# Restart backend (auto-reindexes)
cd ../../backend
npm run dev
```

### Option 2: Load Comprehensive Files (Advanced)

Update `backend/src/services/dataLoaderService.ts`:

```typescript
const acts = [
  // Use comprehensive versions
  { file: 'comprehensive/ipc_complete.json', actName: 'Indian Penal Code, 1860' },
  { file: 'comprehensive/crpc_complete.json', actName: 'Code of Criminal Procedure, 1973' },
  // ... other acts
];
```

---

## 🎯 Quick Expansion Plan

### Phase 1: IPC (35 → 250 sections)
```bash
# Download IPC bare act from indiacode.nic.in
# Parse it
npx ts-node src/scripts/parseBareAct.ts IPC ./bare_acts/ipc_full.txt ./src/data/ipc.json

# Result: ~250 sections
```

### Phase 2: CrPC (26 → 150 sections)
```bash
npx ts-node src/scripts/parseBareAct.ts CRPC ./bare_acts/crpc_full.txt ./src/data/crpc.json

# Result: ~150 sections
```

### Phase 3: IT Act (18 → 80 sections)
```bash
npx ts-node src/scripts/parseBareAct.ts IT_ACT ./bare_acts/it_act_full.txt ./src/data/it_act.json

# Result: ~80 sections
```

### Phase 4: New Acts
```bash
# Evidence Act
npx ts-node src/scripts/parseBareAct.ts EVIDENCE ./bare_acts/evidence.txt ./src/data/evidence_act.json

# Contract Act
npx ts-node src/scripts/parseBareAct.ts CONTRACT ./bare_acts/contract.txt ./src/data/contract_act.json
```

**Total Target: 1000+ sections** 🎉

---

## 🧪 Testing Parser

Create a test file `test_input.txt`:

```
CHAPTER I
TEST CHAPTER

Section 1. Test Section One
This is the text of section one. It contains some legal provisions.

Section 2. Test Section Two
This section talks about punishment. Whoever commits this offence shall be punished with imprisonment up to 7 years.

Section 3. Test Section Three
Another section with more legal text.
```

Run parser:
```bash
npx ts-node src/scripts/parseBareAct.ts IPC ./test_input.txt ./test_output.json
```

Check `test_output.json` - should have 3 sections with auto-extracted data.

---

## 📊 Parser Features

✅ **Auto-extracts**:
- Section numbers (1, 2A, 66A, etc.)
- Section titles
- Section text
- Chapter information
- Punishment clauses
- Top 10 keywords
- Auto-categorization

✅ **Smart Detection**:
- Punishment patterns ("shall be punished with...")
- Keyword extraction (removes stopwords)
- Category assignment (Homicide, Theft, Cyber Crime, etc.)

✅ **ML-Ready Output**:
- `searchable_text` field for vector search
- `keywords` array for quick filtering
- Structured data for database import

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'fs'"
The script needs to run with Node.js, not in browser. Use `npx ts-node` instead of Vite.

### Error: "Unknown act"
Use one of the supported act keys: IPC, CRPC, EVIDENCE, IT_ACT, CONTRACT, COMPANIES, MV_ACT, RTI

### Error: "Input file not found"
Check the path to your bare act text file. Use absolute or relative paths correctly.

### No sections extracted
Check your text file format. Sections should start with "Section X." or just "X."

---

## 🎉 Success Path

1. ✅ Download bare acts as text files
2. ✅ Run parser for each act
3. ✅ Review generated JSON
4. ✅ Copy to `frontend/src/data/`
5. ✅ Restart backend
6. ✅ Auto-reindexing happens
7. ✅ Search 1000+ sections! 🚀

---

## 📞 Need Help?

Check the parser output for statistics:
```
📖 Parsing Indian Penal Code...
✅ Extracted 511 sections

📊 Chapter-wise breakdown:
   INTRODUCTION: 5 sections
   GENERAL EXPLANATIONS: 47 sections
   OF PUNISHMENTS: 18 sections
   ...

✅ Successfully generated: ./data/ipc_complete.json
   Total size: 2.5 MB
   Sections: 511
```

This tells you if parsing was successful.

---

**Ready to expand to 1000+ sections!** 🎯
