import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { analyzeComplaint, ComplaintMetadata } from '../services/complaintAnalysisService';

const router = Router();
const prisma = new PrismaClient();

function metadataFromBody(body: Record<string, unknown>): ComplaintMetadata {
  return {
    incidentDate: typeof body.incidentDate === 'string' ? body.incidentDate : undefined,
    location: typeof body.location === 'string' ? body.location : undefined,
    category: typeof body.category === 'string' ? body.category : undefined,
    evidenceNames: Array.isArray(body.evidenceNames)
      ? body.evidenceNames.filter((value): value is string => typeof value === 'string').slice(0, 20)
      : undefined,
  };
}

router.post('/analyze', async (req: Request, res: Response) => {
  const complaint = typeof req.body?.complaint === 'string'
    ? req.body.complaint
    : typeof req.body?.text === 'string' ? req.body.text : '';

  if (complaint.trim().length < 10) {
    return res.status(400).json({
      error: 'Complaint text is required',
      message: 'Please provide at least 10 characters describing what happened.',
    });
  }

  try {
    const analysis = analyzeComplaint(complaint, metadataFromBody(req.body));
    const submission = await prisma.submission.create({
      data: {
        inputText: complaint.trim(),
        resultJson: JSON.stringify({ complaint, metadata: metadataFromBody(req.body), analysis }),
        confidence: analysis.confidence,
      },
    });
    return res.status(201).json({ success: true, id: submission.id, complaint, analysis });
  } catch (error) {
    console.error('[Complaint Analysis Error]', error);
    return res.status(500).json({ error: 'Analysis failed', message: 'Unable to save or analyze this complaint.' });
  }
});

router.post('/follow-up', async (req: Request, res: Response) => {
  const complaint = typeof req.body?.complaint === 'string' ? req.body.complaint : '';
  if (complaint.trim().length < 10) {
    return res.status(400).json({ error: 'Complaint text is required' });
  }
  try {
    const answers = req.body?.answers && typeof req.body.answers === 'object' ? req.body.answers : {};
    const answerText = Object.values(answers as Record<string, unknown>).filter(value => typeof value === 'string').join(' ');
    const analysis = analyzeComplaint(`${complaint} ${answerText}`.trim(), metadataFromBody(req.body));
    return res.json({ success: true, analysis });
  } catch (error) {
    console.error('[Complaint Follow-up Error]', error);
    return res.status(500).json({ error: 'Follow-up analysis failed' });
  }
});

router.get('/analysis/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Analysis id must be a number' });
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: 'Analysis not found' });
  return res.json({ success: true, id: submission.id, createdAt: submission.createdAt, analysis: JSON.parse(submission.resultJson) });
});

router.get('/:id/analysis', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Analysis id must be a number' });
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: 'Analysis not found' });
  return res.json({ success: true, id: submission.id, createdAt: submission.createdAt, analysis: JSON.parse(submission.resultJson) });
});

router.get('/laws/search', (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  return res.json({ success: true, query, message: 'Use complaint analysis for fact-based section matching. Unverified keyword-only matches are not returned.' });
});

router.get('/laws', (_req, res) => res.json({ success: true, laws: [
  { act: 'Bharatiya Nyaya Sanhita, 2023', source: 'https://www.indiacode.nic.in/' },
  { act: 'Consumer Protection Act, 2019', source: 'https://www.indiacode.nic.in/handle/123456789/15256' },
  { act: 'Information Technology Act, 2000', source: 'https://www.indiacode.nic.in/' },
] }));

router.get('/legal-authorities', (_req, res) => res.json({ success: true, authorities: [
  { name: 'Local police station', source: 'https://digitalpolice.gov.in/' },
  { name: 'National Cyber Crime Reporting Portal', source: 'https://www.cybercrime.gov.in/' },
  { name: 'National Consumer Helpline', source: 'https://consumerhelpline.gov.in/' },
  { name: 'NALSA legal aid', source: 'https://nalsa.gov.in/' },
] }));

router.get('/legal-remedies', (_req, res) => res.json({ success: true, remedies: [
  'Police complaint or FIR where the facts disclose an offence',
  'Consumer or civil complaint for service failure, loss or breach',
  'Legal aid through the District Legal Services Authority',
] }));

export default router;
