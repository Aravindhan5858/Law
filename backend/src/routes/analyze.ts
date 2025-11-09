import { Router } from 'express';
import { simpleMatch } from '../services/matcherService';

const router = Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a longer description' });
  }

  // Rule-based matching using shared matcherService
  const matches = simpleMatch(text);

  // Minimal response format
  const response = {
    query: text,
    recommendations: matches,
    disclaimer: 'This tool provides informational suggestions only and is not legal advice.'
  };

  return res.json(response);
});

export default router;
