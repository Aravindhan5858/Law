import { Router } from 'express';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Load IPC sections data
const ipcSectionsPath = path.join(__dirname, '../../data/ipc_sections.json');
let ipcSectionsData: any = null;

try {
  const data = fs.readFileSync(ipcSectionsPath, 'utf-8');
  ipcSectionsData = JSON.parse(data);
  console.log(`✅ Loaded ${ipcSectionsData.sections.length} IPC sections`);
} catch (error) {
  console.error('❌ Failed to load IPC sections data:', error);
}

/**
 * Get detailed information for an IPC section
 */
function getSectionDetails(sectionNumber: string): any {
  if (!ipcSectionsData) return null;
  
  return ipcSectionsData.sections.find(
    (s: any) => s.section === sectionNumber || s.section === sectionNumber.toString()
  );
}

/**
 * Call ML service for IPC section prediction
 */
async function predictSection(text: string): Promise<any> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, 
      { text },
      { 
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('ML Service Error:', error.message);
    
    // If ML service is down, return null to trigger fallback
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('⚠️  ML service unavailable, will use fallback');
      return null;
    }
    
    throw error;
  }
}

/**
 * Simple keyword-based fallback when ML service is unavailable
 */
function fallbackPredict(text: string): string | null {
  const lower = text.toLowerCase();
  
  // Simple keyword matching
  if (lower.includes('murder') || lower.includes('killed')) return '302';
  if (lower.includes('death') && (lower.includes('accident') || lower.includes('negligent'))) return '304';
  if (lower.includes('hit') || lower.includes('assault') || lower.includes('beat')) return '323';
  if (lower.includes('steal') || lower.includes('stole') || lower.includes('theft')) return '379';
  if (lower.includes('cheat') || lower.includes('fraud') || lower.includes('scam')) return '420';
  if (lower.includes('threat') || lower.includes('intimidate')) return '506';
  if (lower.includes('molest') || lower.includes('touch') || lower.includes('harass')) return '354';
  if (lower.includes('rape') || lower.includes('sexual assault')) return '376';
  if (lower.includes('dowry') || lower.includes('cruelty') || lower.includes('husband')) return '498A';
  if (lower.includes('robbery') || lower.includes('robbed') || lower.includes('loot')) return '392';
  if (lower.includes('forge') || lower.includes('fake document') || lower.includes('counterfeit')) return '467';
  if (lower.includes('cyber') || lower.includes('online') || lower.includes('phishing')) return '66D';
  if (lower.includes('insult') && lower.includes('woman')) return '509';
  if (lower.includes('insult') || lower.includes('abuse')) return '504';
  if (lower.includes('breach of trust') || lower.includes('embezzle')) return '406';
  
  return null;
}

router.post('/', async (req, res) => {
  const { text } = req.body;
  
  // Validation
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return res.status(400).json({ 
      error: 'Please provide a longer description of your legal issue' 
    });
  }

  try {
    let predictedSection: string | null = null;
    let confidence: number = 0;
    let method: string = 'none';
    
    // Try ML service first
    const mlPrediction = await predictSection(text);
    
    if (mlPrediction && mlPrediction.section) {
      predictedSection = mlPrediction.section;
      confidence = mlPrediction.confidence || 0;
      method = mlPrediction.method || 'ml';
      console.log(`✅ ML Prediction: Section ${predictedSection} (confidence: ${confidence}, method: ${method})`);
    } else {
      // Fallback to simple keyword matching
      predictedSection = fallbackPredict(text);
      confidence = predictedSection ? 0.65 : 0;
      method = 'keyword-fallback';
      console.log(`⚠️  Using fallback: Section ${predictedSection || 'none'}`);
    }
    
    // If no prediction, ask for more details
    if (!predictedSection) {
      return res.json({
        query: text,
        confidence: 0,
        method: method,
        recommendations: [],
        message: 'Could not determine the applicable legal section. Please provide more details about the incident, including who was involved, what happened, when and where it occurred.',
        disclaimer: 'This tool provides informational suggestions only and is not legal advice. Please consult a qualified lawyer for accurate legal guidance.'
      });
    }
    
    // Get detailed section information
    const sectionDetails = getSectionDetails(predictedSection);
    
    if (!sectionDetails) {
      return res.status(500).json({ 
        error: `Section ${predictedSection} found but details not available` 
      });
    }
    
    // Format response
    const response = {
      query: text,
      confidence: confidence,
      method: method,
      recommendations: [{
        section: sectionDetails.section,
        title: sectionDetails.title,
        description: sectionDetails.description,
        punishment: sectionDetails.punishment,
        case_type: sectionDetails.case_type,
        bailable: sectionDetails.bailable,
        cognizable: sectionDetails.cognizable,
        procedure: sectionDetails.procedure,
        examples: sectionDetails.examples,
        keywords: sectionDetails.keywords
      }],
      disclaimer: 'This tool provides informational suggestions only and is not legal advice. Please consult a qualified lawyer for accurate legal guidance.'
    };
    
    return res.json(response);
    
  } catch (error: any) {
    console.error('Analysis Error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while analyzing your complaint. Please try again.',
      details: error.message 
    });
  }
});

export default router;
