import { Router, Request, Response } from 'express';
import { legalAnalysisService } from '../services/legalAnalysisService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { incidentDescription, language = 'english' } = req.body;

  if (!incidentDescription || typeof incidentDescription !== 'string' || incidentDescription.trim().length < 10) {
    return res.status(400).json({
      message: 'Please provide a detailed incident description (at least 10 characters)'
    });
  }

  try {
    const analysis = legalAnalysisService.analyzeComplaint(incidentDescription.trim());
    const sections = analysis.applicableSections.map(section => ({
      section: section.section,
      short_desc: section.title
    }));

    const complaintText = language === 'tanglish'
      ? `Naan ${incidentDescription.trim()}. Indha sambavam patri complaint padhivu seydhu, thevaiyana sattapadi nadavadikkai edukka vendugiren.`
      : `I would like to report the following incident: ${incidentDescription.trim()}. Please register my complaint and take appropriate action under the applicable law.`;

    return res.json({
      response: {
        sections,
        complaint_text: complaintText,
        recommended_actions: analysis.actionSteps.map(step => step.action),
        evidence_checklist: [
          'Save photographs, medical records, and CCTV details',
          'Keep witness names and contact information',
          'Preserve relevant messages, calls, and other documents'
        ]
      }
    });
  } catch (error) {
    console.error('[Assault Assistant Error]', error);
    return res.status(500).json({ message: 'Failed to generate complaint guidance' });
  }
});

export default router;
