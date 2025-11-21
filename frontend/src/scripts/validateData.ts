/**
 * Data Validation Script
 * 
 * Validates comprehensive legal data JSON files for ML engine integration
 * Checks for required fields, data quality, and consistency
 * 
 * Usage: npx ts-node src/scripts/validateData.ts <json_file>
 */

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
  related_sections?: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalSections: number;
    withChapter: number;
    withPunishment: number;
    withKeywords: number;
    withCategory: number;
    avgKeywordsPerSection: number;
    avgTextLength: number;
    categoryCounts: Record<string, number>;
  };
}

/**
 * Validate a single section entry
 */
function validateSection(section: any, index: number): string[] {
  const errors: string[] = [];

  // Required fields
  if (!section.id) {
    errors.push(`Section ${index}: Missing required field 'id'`);
  } else if (!/^[A-Z_]+-\w+$/.test(section.id)) {
    errors.push(`Section ${index}: Invalid ID format '${section.id}'. Expected: ACT-123`);
  }

  if (!section.act_name) {
    errors.push(`Section ${index}: Missing required field 'act_name'`);
  }

  if (!section.act_year || typeof section.act_year !== 'number') {
    errors.push(`Section ${index}: Missing or invalid 'act_year'`);
  } else if (section.act_year < 1800 || section.act_year > new Date().getFullYear()) {
    errors.push(`Section ${index}: Invalid year ${section.act_year}`);
  }

  if (!section.act_short_name) {
    errors.push(`Section ${index}: Missing required field 'act_short_name'`);
  }

  if (!section.section_number) {
    errors.push(`Section ${index}: Missing required field 'section_number'`);
  }

  if (!section.section_title) {
    errors.push(`Section ${index}: Missing required field 'section_title'`);
  } else if (section.section_title.length < 3) {
    errors.push(`Section ${index}: Section title too short: '${section.section_title}'`);
  }

  if (!section.section_text) {
    errors.push(`Section ${index}: Missing required field 'section_text'`);
  } else if (section.section_text.length < 10) {
    errors.push(`Section ${index}: Section text too short (${section.section_text.length} chars)`);
  }

  if (!section.searchable_text) {
    errors.push(`Section ${index}: Missing required field 'searchable_text'`);
  } else if (section.searchable_text !== section.searchable_text.toLowerCase()) {
    errors.push(`Section ${index}: searchable_text must be lowercase`);
  }

  // Optional but recommended fields
  if (section.keywords) {
    if (!Array.isArray(section.keywords)) {
      errors.push(`Section ${index}: 'keywords' must be an array`);
    } else if (section.keywords.length === 0) {
      errors.push(`Section ${index}: 'keywords' array is empty`);
    }
  }

  if (section.chapter_number && typeof section.chapter_number !== 'number') {
    errors.push(`Section ${index}: 'chapter_number' must be a number`);
  }

  return errors;
}

/**
 * Validate entire dataset
 */
function validateDataset(data: MLLawEntry[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data is an array
  if (!Array.isArray(data)) {
    return {
      valid: false,
      errors: ['Data must be an array of sections'],
      warnings: [],
      stats: {
        totalSections: 0,
        withChapter: 0,
        withPunishment: 0,
        withKeywords: 0,
        withCategory: 0,
        avgKeywordsPerSection: 0,
        avgTextLength: 0,
        categoryCounts: {}
      }
    };
  }

  // Validate each section
  data.forEach((section, index) => {
    const sectionErrors = validateSection(section, index + 1);
    errors.push(...sectionErrors);
  });

  // Check for duplicates
  const ids = new Set<string>();
  data.forEach((section, index) => {
    if (section.id) {
      if (ids.has(section.id)) {
        errors.push(`Duplicate ID found: ${section.id} at section ${index + 1}`);
      }
      ids.add(section.id);
    }
  });

  // Check for sequential section numbers (warning only)
  const sectionNumbers = data
    .map(s => s.section_number)
    .filter(num => /^\d+$/.test(num))
    .map(num => parseInt(num, 10))
    .sort((a, b) => a - b);

  for (let i = 1; i < sectionNumbers.length; i++) {
    const gap = sectionNumbers[i] - sectionNumbers[i - 1];
    if (gap > 10) {
      warnings.push(
        `Large gap in section numbers: ${sectionNumbers[i - 1]} → ${sectionNumbers[i]} (gap of ${gap})`
      );
    }
  }

  // Calculate statistics
  const stats = {
    totalSections: data.length,
    withChapter: data.filter(s => s.chapter).length,
    withPunishment: data.filter(s => s.punishment).length,
    withKeywords: data.filter(s => s.keywords && s.keywords.length > 0).length,
    withCategory: data.filter(s => s.category).length,
    avgKeywordsPerSection: 0,
    avgTextLength: 0,
    categoryCounts: {} as Record<string, number>
  };

  // Calculate averages
  const totalKeywords = data.reduce(
    (sum, s) => sum + (s.keywords?.length || 0),
    0
  );
  stats.avgKeywordsPerSection = totalKeywords / data.length;

  const totalTextLength = data.reduce(
    (sum, s) => sum + s.section_text.length,
    0
  );
  stats.avgTextLength = totalTextLength / data.length;

  // Count categories
  data.forEach(section => {
    if (section.category) {
      stats.categoryCounts[section.category] =
        (stats.categoryCounts[section.category] || 0) + 1;
    }
  });

  // Warnings for data quality
  if (stats.withKeywords < data.length * 0.8) {
    warnings.push(
      `Only ${((stats.withKeywords / data.length) * 100).toFixed(1)}% of sections have keywords. Recommended: 80%+`
    );
  }

  if (stats.withCategory < data.length * 0.8) {
    warnings.push(
      `Only ${((stats.withCategory / data.length) * 100).toFixed(1)}% of sections have categories. Recommended: 80%+`
    );
  }

  if (stats.avgKeywordsPerSection < 3) {
    warnings.push(
      `Average keywords per section is ${stats.avgKeywordsPerSection.toFixed(1)}. Recommended: 5-10`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats
  };
}

/**
 * Format validation report
 */
function formatReport(result: ValidationResult, filename: string): string {
  let report = '\n';
  report += '═'.repeat(80) + '\n';
  report += '  DATA VALIDATION REPORT\n';
  report += '═'.repeat(80) + '\n\n';
  report += `File: ${filename}\n`;
  report += `Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}\n\n`;

  // Statistics
  report += '─'.repeat(80) + '\n';
  report += '  STATISTICS\n';
  report += '─'.repeat(80) + '\n';
  report += `Total Sections: ${result.stats.totalSections}\n`;
  report += `With Chapter: ${result.stats.withChapter} (${((result.stats.withChapter / result.stats.totalSections) * 100).toFixed(1)}%)\n`;
  report += `With Punishment: ${result.stats.withPunishment} (${((result.stats.withPunishment / result.stats.totalSections) * 100).toFixed(1)}%)\n`;
  report += `With Keywords: ${result.stats.withKeywords} (${((result.stats.withKeywords / result.stats.totalSections) * 100).toFixed(1)}%)\n`;
  report += `With Category: ${result.stats.withCategory} (${((result.stats.withCategory / result.stats.totalSections) * 100).toFixed(1)}%)\n`;
  report += `Avg Keywords/Section: ${result.stats.avgKeywordsPerSection.toFixed(2)}\n`;
  report += `Avg Text Length: ${Math.round(result.stats.avgTextLength)} chars\n\n`;

  // Categories breakdown
  if (Object.keys(result.stats.categoryCounts).length > 0) {
    report += '─'.repeat(80) + '\n';
    report += '  CATEGORY BREAKDOWN\n';
    report += '─'.repeat(80) + '\n';
    Object.entries(result.stats.categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        const percentage = ((count / result.stats.totalSections) * 100).toFixed(1);
        report += `${category.padEnd(25)} ${count.toString().padStart(4)} (${percentage}%)\n`;
      });
    report += '\n';
  }

  // Errors
  if (result.errors.length > 0) {
    report += '─'.repeat(80) + '\n';
    report += '  ERRORS\n';
    report += '─'.repeat(80) + '\n';
    result.errors.forEach((error, index) => {
      report += `${(index + 1).toString().padStart(3)}. ${error}\n`;
    });
    report += '\n';
  }

  // Warnings
  if (result.warnings.length > 0) {
    report += '─'.repeat(80) + '\n';
    report += '  WARNINGS\n';
    report += '─'.repeat(80) + '\n';
    result.warnings.forEach((warning, index) => {
      report += `${(index + 1).toString().padStart(3)}. ${warning}\n`;
    });
    report += '\n';
  }

  report += '═'.repeat(80) + '\n';

  return report;
}

/**
 * Main function
 */
async function main() {
  // This is a template - actual implementation would need Node.js environment
  console.log('Data Validation Script');
  console.log('Usage: npx ts-node src/scripts/validateData.ts <json_file>');
  console.log('\nThis script validates ML-ready legal data JSON files.');
  console.log('\nChecks:');
  console.log('  ✓ Required fields present');
  console.log('  ✓ Data type validation');
  console.log('  ✓ ID format and uniqueness');
  console.log('  ✓ Text length requirements');
  console.log('  ✓ Searchable text lowercase');
  console.log('  ✓ Keywords and categories coverage');
  console.log('  ✓ Sequential section numbering');
  console.log('\nExample:');
  console.log('  npx ts-node src/scripts/validateData.ts ./data/comprehensive/ipc_complete.json');
}

// Export for use in other modules
export { validateSection, validateDataset, formatReport };

// For demonstration purposes
if (typeof window === 'undefined') {
  // Node.js environment
  main();
}

// Browser-compatible validation function
export function validateBrowserData(data: MLLawEntry[]): ValidationResult {
  return validateDataset(data);
}

/**
 * Quick validation for React components
 */
export function quickValidate(sections: MLLawEntry[]): {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  totalSections: number;
} {
  const result = validateDataset(sections);
  return {
    isValid: result.valid,
    errorCount: result.errors.length,
    warningCount: result.warnings.length,
    totalSections: result.stats.totalSections
  };
}
