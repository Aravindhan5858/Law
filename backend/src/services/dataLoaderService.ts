/**
 * Data Loader Service
 * Loads all legal sections from multiple acts
 */

import fs from 'fs';
import path from 'path';

interface LegalSection {
  section_number: string;
  act_name?: string;
  title: string;
  text?: string;
  definition?: string;
  punishment: string;
  example_case?: string;
  example?: string;
  related_cases?: string[];
}

class DataLoaderService {
  private dataPath: string;

  constructor() {
    // Try both frontend and backend data paths
    const frontendPath = path.join(__dirname, '../../../frontend/src/data');
    const backendPath = path.join(__dirname, '../../data');
    
    this.dataPath = fs.existsSync(frontendPath) ? frontendPath : backendPath;
    console.log(`[DataLoader] Using data path: ${this.dataPath}`);
  }

  /**
   * Load all sections from all acts
   */
  async loadAllSections(): Promise<LegalSection[]> {
    const allSections: LegalSection[] = [];

    const acts = [
      { file: 'ipc.json', actName: 'Indian Penal Code, 1860' },
      { file: 'crpc.json', actName: 'Code of Criminal Procedure, 1973' },
      { file: 'it_act.json', actName: 'Information Technology Act, 2000' },
      { file: 'consumer_act.json', actName: 'Consumer Protection Act, 2019' },
      { file: 'rti_act.json', actName: 'Right to Information Act, 2005' },
      { file: 'motor_vehicles_act.json', actName: 'Motor Vehicles Act, 1988' },
      { file: 'evidence_act.json', actName: 'Indian Evidence Act, 1872' },
      { file: 'contract_act.json', actName: 'Indian Contract Act, 1872' }
    ];

    for (const act of acts) {
      try {
        const sections = await this.loadAct(act.file, act.actName);
        allSections.push(...sections);
        console.log(`[DataLoader] Loaded ${sections.length} sections from ${act.actName}`);
      } catch (error: any) {
        console.warn(`[DataLoader] Warning: Could not load ${act.file}: ${error.message}`);
      }
    }

    console.log(`[DataLoader] Total sections loaded: ${allSections.length}`);
    return allSections;
  }

  /**
   * Load sections from a specific act
   */
  private async loadAct(filename: string, actName: string): Promise<LegalSection[]> {
    const filePath = path.join(this.dataPath, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sections = JSON.parse(fileContent);

    // Normalize the data structure
    return sections.map((section: any) => ({
      section_number: section.section_number || section.section || '',
      act_name: section.act_name || actName,
      title: section.title || '',
      text: section.text || section.definition || '',
      definition: section.definition || section.text || '',
      punishment: section.punishment || 'Not specified',
      example_case: section.example_case || section.example || '',
      example: section.example || section.example_case || '',
      related_cases: section.related_cases || []
    }));
  }

  /**
   * Get data path
   */
  getDataPath(): string {
    return this.dataPath;
  }
}

export const dataLoaderService = new DataLoaderService();
export default DataLoaderService;
