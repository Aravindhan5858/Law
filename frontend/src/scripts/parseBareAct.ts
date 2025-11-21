/**
 * Bare Act Parser - Converts plain text bare acts into ML-ready JSON format
 * 
 * Usage: 
 * ts-node src/scripts/parseBareAct.ts <act_name> <input_file> <output_file>
 * 
 * Example:
 * ts-node src/scripts/parseBareAct.ts IPC ./bare_acts/ipc.txt ./data/comprehensive/ipc_complete.json
 */

/// <reference types="node" />

import fs from 'fs';
import * as path from 'path';

interface MLLawEntry {
  id: string;
  act_name: string;
  act_year: number;
  act_short_name: string;
  section_number: string;
  section_title: string;
  section_text: string;
  chapter?: string;
  chapter_number?: number;
  punishment?: string;
  example_case?: string;
  keywords?: string[];
  category?: string;
  searchable_text: string;
}

interface ActMetadata {
  fullName: string;
  year: number;
  shortName: string;
}

const ACT_CONFIGS: Record<string, ActMetadata> = {
  IPC: { fullName: 'Indian Penal Code', year: 1860, shortName: 'IPC' },
  CRPC: { fullName: 'Code of Criminal Procedure', year: 1973, shortName: 'CrPC' },
  EVIDENCE: { fullName: 'Indian Evidence Act', year: 1872, shortName: 'Evidence Act' },
  IT_ACT: { fullName: 'Information Technology Act', year: 2000, shortName: 'IT Act' },
  CONTRACT: { fullName: 'Indian Contract Act', year: 1872, shortName: 'Contract Act' },
  COMPANIES: { fullName: 'Companies Act', year: 2013, shortName: 'Companies Act' },
  MV_ACT: { fullName: 'Motor Vehicles Act', year: 1988, shortName: 'MV Act' },
  RTI: { fullName: 'Right to Information Act', year: 2005, shortName: 'RTI Act' }
};

/**
 * Parse bare act text file and extract sections
 */
function parseBareAct(content: string, actKey: string): MLLawEntry[] {
  const actMeta = ACT_CONFIGS[actKey];
  if (!actMeta) {
    throw new Error(`Unknown act: ${actKey}. Available: ${Object.keys(ACT_CONFIGS).join(', ')}`);
  }

  const sections: MLLawEntry[] = [];
  let currentChapter = '';
  let currentChapterNumber = 0;

  // Common patterns for section extraction
  // Pattern 1: "Section 302. Murder" or "302. Murder"
  // Pattern 2: "Section 302.—Murder" or "302.—Murder"
  const sectionPattern = /(?:Section\s+)?(\d+[A-Z]?)\.\s*(?:—|-)?\s*(.+?)(?=\n\n|\n(?:Section\s+)?\d+[A-Z]?\.|\n\nCHAPTER|$)/gis;
  const chapterPattern = /CHAPTER\s+([IVXLCDM]+|[A-Z]+|\d+)\s*\n\s*(.+?)(?=\n\nSection|\n\n\d+\.)/gi;

  // Extract chapters
  let match;
  const chapters: Array<{ number: number; name: string; position: number }> = [];
  while ((match = chapterPattern.exec(content)) !== null) {
    chapters.push({
      number: chapters.length + 1,
      name: match[2].trim(),
      position: match.index
    });
  }

  // Extract sections
  const sectionMatches = [...content.matchAll(sectionPattern)];
  
  sectionMatches.forEach((match, index) => {
    const sectionNumber = match[1].trim();
    const remainingText = match[2].trim();
    
    // Split title and text (title is usually the first line)
    const lines = remainingText.split('\n');
    const sectionTitle = lines[0].trim();
    const sectionText = lines.slice(1).join('\n').trim() || remainingText;

    // Determine chapter for this section
    const sectionPosition = match.index!;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (sectionPosition > chapters[i].position) {
        currentChapter = chapters[i].name;
        currentChapterNumber = chapters[i].number;
        break;
      }
    }

    // Extract punishment if present
    const punishment = extractPunishment(sectionText);

    // Create searchable text
    const searchableText = [
      sectionNumber,
      sectionTitle,
      sectionText,
      actMeta.fullName,
      actMeta.shortName
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Extract keywords
    const keywords = extractKeywords(searchableText);

    // Categorize section
    const category = categorizeSection(sectionText, actKey);

    sections.push({
      id: `${actMeta.shortName}-${sectionNumber}`,
      act_name: actMeta.fullName,
      act_year: actMeta.year,
      act_short_name: actMeta.shortName,
      section_number: sectionNumber,
      section_title: sectionTitle,
      section_text: sectionText,
      chapter: currentChapter || undefined,
      chapter_number: currentChapterNumber || undefined,
      punishment,
      keywords,
      category,
      searchable_text: searchableText
    });
  });

  return sections;
}

/**
 * Extract punishment details from section text
 */
function extractPunishment(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  
  // Look for punishment-related keywords
  const punishmentPatterns = [
    /shall be punished with (.+?)(?:\.|,|;|$)/i,
    /punishable with (.+?)(?:\.|,|;|$)/i,
    /imprisonment .+? (?:and|or) .+? fine/i,
    /death|life imprisonment|rigorous imprisonment|simple imprisonment/i,
    /fine .+? rupees/i
  ];

  for (const pattern of punishmentPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return undefined;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string, topN: number = 10): string[] {
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'shall', 'any', 'or', 'which', 'this',
    'such', 'been', 'have', 'may', 'said', 'being', 'under', 'than'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word));

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top N
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Categorize section based on content
 */
function categorizeSection(text: string, actKey: string): string {
  const lowerText = text.toLowerCase();

  // Act-specific categories
  if (actKey === 'IPC') {
    if (/murder|culpable homicide|death|killing/.test(lowerText)) return 'Homicide';
    if (/theft|robbery|dacoity|burglary|stolen/.test(lowerText)) return 'Theft & Robbery';
    if (/rape|sexual|modesty|harassment/.test(lowerText)) return 'Sexual Offences';
    if (/assault|hurt|grievous|force|violence/.test(lowerText)) return 'Violence';
    if (/cheating|fraud|deception|dishonest/.test(lowerText)) return 'Fraud & Cheating';
    if (/forgery|counterfeit|false document/.test(lowerText)) return 'Forgery';
    if (/defamation|reputation|imputation/.test(lowerText)) return 'Defamation';
    if (/criminal conspiracy|abetment/.test(lowerText)) return 'Conspiracy';
    return 'Criminal';
  }

  if (actKey === 'IT_ACT') {
    if (/hacking|unauthorized access|computer/.test(lowerText)) return 'Cyber Crime';
    if (/data|information|privacy/.test(lowerText)) return 'Data Protection';
    if (/electronic signature|digital signature/.test(lowerText)) return 'Digital Authentication';
    return 'Cyber';
  }

  if (actKey === 'CRPC') {
    if (/arrest|detention|custody/.test(lowerText)) return 'Arrest';
    if (/bail|bond|surety/.test(lowerText)) return 'Bail';
    if (/investigation|inquiry|search/.test(lowerText)) return 'Investigation';
    if (/trial|court|judgment/.test(lowerText)) return 'Trial';
    return 'Procedural';
  }

  if (actKey === 'EVIDENCE') {
    if (/confession|admission/.test(lowerText)) return 'Confessions';
    if (/witness|testimony/.test(lowerText)) return 'Witness';
    if (/document|electronic record/.test(lowerText)) return 'Documentary Evidence';
    if (/burden of proof|presumption/.test(lowerText)) return 'Burden of Proof';
    return 'Evidence';
  }

  if (actKey === 'CONTRACT') {
    if (/offer|acceptance|proposal/.test(lowerText)) return 'Contract Formation';
    if (/breach|damage|compensation/.test(lowerText)) return 'Breach';
    if (/void|voidable|illegal/.test(lowerText)) return 'Validity';
    if (/consideration|promise/.test(lowerText)) return 'Consideration';
    return 'Contract';
  }

  if (actKey === 'COMPANIES') {
    if (/director|board|management/.test(lowerText)) return 'Corporate Governance';
    if (/share|capital|dividend/.test(lowerText)) return 'Share Capital';
    if (/audit|accounts|financial/.test(lowerText)) return 'Audit & Accounts';
    if (/winding up|liquidation/.test(lowerText)) return 'Winding Up';
    return 'Corporate';
  }

  if (actKey === 'MV_ACT') {
    if (/licence|permit|registration/.test(lowerText)) return 'Licensing';
    if (/accident|insurance|compensation/.test(lowerText)) return 'Accidents';
    if (/offence|penalty|fine/.test(lowerText)) return 'Traffic Offences';
    return 'Traffic';
  }

  if (actKey === 'RTI') {
    if (/right to information|disclosure/.test(lowerText)) return 'Information Rights';
    if (/appeal|complaint/.test(lowerText)) return 'Appeals';
    if (/penalty|fine/.test(lowerText)) return 'Penalties';
    return 'Rights';
  }

  return 'General';
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: ts-node parseBareAct.ts <ACT_KEY> <input_file> <output_file>');
    console.error('Example: ts-node parseBareAct.ts IPC ./bare_acts/ipc.txt ./data/comprehensive/ipc_complete.json');
    console.error('\nAvailable ACT_KEYs:', Object.keys(ACT_CONFIGS).join(', '));
    process.exit(1);
  }

  const [actKey, inputFile, outputFile] = args;

  // Validate act key
  if (!ACT_CONFIGS[actKey]) {
    console.error(`Error: Unknown act "${actKey}". Available: ${Object.keys(ACT_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`\n📖 Parsing ${ACT_CONFIGS[actKey].fullName}...`);
  console.log(`   Input: ${inputFile}`);
  console.log(`   Output: ${outputFile}\n`);

  // Read and parse
  const content = fs.readFileSync(inputFile, 'utf-8');
  const sections = parseBareAct(content, actKey);

  console.log(`✅ Extracted ${sections.length} sections`);

  // Group by chapter for statistics
  const chapterStats: Record<string, number> = {};
  sections.forEach(section => {
    if (section.chapter) {
      chapterStats[section.chapter] = (chapterStats[section.chapter] || 0) + 1;
    }
  });

  console.log(`\n📊 Chapter-wise breakdown:`);
  Object.entries(chapterStats).forEach(([chapter, count]) => {
    console.log(`   ${chapter}: ${count} sections`);
  });

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(sections, null, 2));

  console.log(`\n✅ Successfully generated: ${outputFile}`);
  console.log(`   Total size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
  console.log(`   Sections: ${sections.length}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   1. Review the generated JSON for accuracy`);
  console.log(`   2. Update dataLoader.ts to import this file`);
  console.log(`   3. Rebuild the search index\n`);
}

// Export functions
export { parseBareAct, extractKeywords, categorizeSection };

// Run if called directly (works with both ESM and CommonJS)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
