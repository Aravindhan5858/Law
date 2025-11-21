import express, { Request, Response } from 'express';
import { legalAnalysisService } from '../services/legalAnalysisService';

const router = express.Router();

/**
 * POST /api/legal-analysis/analyze
 * Analyze a complaint and get structured legal analysis
 */
router.post('/analyze', (req: Request, res: Response) => {
  try {
    const { complaint } = req.body;

    if (!complaint || typeof complaint !== 'string') {
      return res.status(400).json({
        error: 'Complaint text is required',
        message: 'Please provide complaint in request body as: { "complaint": "your complaint text" }'
      });
    }

    if (complaint.trim().length < 10) {
      return res.status(400).json({
        error: 'Complaint too short',
        message: 'Please provide a detailed complaint (at least 10 characters)'
      });
    }

    const analysis = legalAnalysisService.analyzeComplaint(complaint);

    res.json({
      success: true,
      complaint: complaint.substring(0, 100) + (complaint.length > 100 ? '...' : ''),
      analysis
    });
  } catch (error) {
    console.error('[Legal Analysis Error]', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legal-analysis/health
 * Health check for legal analysis service
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Legal Analysis Service',
    version: '1.0.0'
  });
});

export default router;
