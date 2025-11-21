#!/bin/bash

# 🚀 Legal Corpus Expansion - From 154 to 1000+ Sections
# Quick automation script

set -e

echo "════════════════════════════════════════════════════════"
echo "  📖 Legal Search Corpus Expansion Tool"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
BARE_ACTS_DIR="bare_acts"
DATA_DIR="frontend/src/data"
COMPREHENSIVE_DIR="$DATA_DIR/comprehensive"
SCRIPT_PATH="frontend/src/scripts/parseBareAct.ts"

# Create directories
mkdir -p "$BARE_ACTS_DIR"
mkdir -p "$COMPREHENSIVE_DIR"

echo -e "${BLUE}📁 Directory Structure:${NC}"
echo "   Bare Acts: $BARE_ACTS_DIR/"
echo "   Output: $COMPREHENSIVE_DIR/"
echo ""

# Function to parse a bare act
parse_act() {
    local ACT_KEY=$1
    local INPUT_FILE=$2
    local OUTPUT_FILE=$3
    local ACT_NAME=$4

    if [ ! -f "$INPUT_FILE" ]; then
        echo -e "${YELLOW}⚠ Skipping $ACT_NAME - file not found: $INPUT_FILE${NC}"
        return 0
    fi

    echo -e "${BLUE}📖 Parsing $ACT_NAME...${NC}"
    cd frontend
    npx ts-node --esm "src/scripts/parseBareAct.ts" "$ACT_KEY" "../$INPUT_FILE" "../$OUTPUT_FILE"
    cd ..
    
    # Count sections
    SECTION_COUNT=$(jq 'length' "$OUTPUT_FILE")
    echo -e "${GREEN}   ✅ Extracted $SECTION_COUNT sections${NC}"
    echo ""
}

# Show instructions
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}  📝 INSTRUCTIONS${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo ""
echo "Place your bare act text files in $BARE_ACTS_DIR/"
echo ""
echo "Required files (download from https://www.indiacode.nic.in/):"
echo "  • ipc.txt          - Indian Penal Code (511 sections)"
echo "  • crpc.txt         - Code of Criminal Procedure (484 sections)"
echo "  • evidence.txt     - Indian Evidence Act (167 sections)"
echo "  • it_act.txt       - Information Technology Act (94 sections)"
echo "  • contract.txt     - Indian Contract Act (238 sections)"
echo "  • companies.txt    - Companies Act (470 sections)"
echo "  • mv_act.txt       - Motor Vehicles Act (217 sections)"
echo "  • rti.txt          - Right to Information Act (31 sections)"
echo ""
echo -e "${BLUE}Target: 2,212 sections total${NC}"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo ""

# Check if user wants to continue
read -p "Do you have bare act files ready? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}No problem! Here's how to get them:${NC}"
    echo ""
    echo "1. Visit: https://www.indiacode.nic.in/"
    echo "2. Search for each act"
    echo "3. Copy the full text"
    echo "4. Save as .txt files in $BARE_ACTS_DIR/"
    echo ""
    echo -e "${GREEN}OR use the sample file we created:${NC}"
    echo "   $BARE_ACTS_DIR/sample_ipc.txt (22 sections)"
    echo ""
    echo "Run this script again when ready!"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 Starting parsing...${NC}"
echo ""

# Parse all available acts
parse_act "IPC" "$BARE_ACTS_DIR/ipc.txt" "$COMPREHENSIVE_DIR/ipc_complete.json" "Indian Penal Code"
parse_act "CRPC" "$BARE_ACTS_DIR/crpc.txt" "$COMPREHENSIVE_DIR/crpc_complete.json" "Code of Criminal Procedure"
parse_act "EVIDENCE" "$BARE_ACTS_DIR/evidence.txt" "$COMPREHENSIVE_DIR/evidence_complete.json" "Indian Evidence Act"
parse_act "IT_ACT" "$BARE_ACTS_DIR/it_act.txt" "$COMPREHENSIVE_DIR/it_act_complete.json" "Information Technology Act"
parse_act "CONTRACT" "$BARE_ACTS_DIR/contract.txt" "$COMPREHENSIVE_DIR/contract_complete.json" "Indian Contract Act"
parse_act "COMPANIES" "$BARE_ACTS_DIR/companies.txt" "$COMPREHENSIVE_DIR/companies_complete.json" "Companies Act"
parse_act "MV_ACT" "$BARE_ACTS_DIR/mv_act.txt" "$COMPREHENSIVE_DIR/mv_act_complete.json" "Motor Vehicles Act"
parse_act "RTI" "$BARE_ACTS_DIR/rti.txt" "$COMPREHENSIVE_DIR/rti_complete.json" "Right to Information Act"

# Count total sections
echo -e "${BLUE}📊 Calculating totals...${NC}"
TOTAL=0
for file in $COMPREHENSIVE_DIR/*.json; do
    if [ -f "$file" ]; then
        COUNT=$(jq 'length' "$file" 2>/dev/null || echo "0")
        TOTAL=$((TOTAL + COUNT))
        FILENAME=$(basename "$file")
        echo "   $FILENAME: $COUNT sections"
    fi
done

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ PARSING COMPLETE${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Total sections parsed: $TOTAL${NC}"
echo ""

# Ask about integration
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}  🔄 INTEGRATION${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Review the generated JSON files in:"
echo "   $COMPREHENSIVE_DIR/"
echo ""
echo "2. Update backend data loader:"
echo "   Edit: backend/src/services/dataLoaderService.ts"
echo "   Change file paths to comprehensive/*.json"
echo ""
echo "3. Restart backend to reindex:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Test the search:"
echo "   curl 'http://localhost:4000/api/search/stats'"
echo ""

read -p "Auto-update data loader now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}📝 Updating data loader...${NC}"
    
    # Create backup
    cp backend/src/services/dataLoaderService.ts backend/src/services/dataLoaderService.ts.backup
    
    # This is a placeholder - user needs to manually update
    echo -e "${YELLOW}⚠ Manual step required:${NC}"
    echo "   Edit: backend/src/services/dataLoaderService.ts"
    echo "   Change file paths from:"
    echo "     'ipc.json' → 'comprehensive/ipc_complete.json'"
    echo "     'crpc.json' → 'comprehensive/crpc_complete.json'"
    echo "     etc."
    echo ""
fi

echo ""
echo -e "${GREEN}🎉 Ready to search $TOTAL sections!${NC}"
echo ""
