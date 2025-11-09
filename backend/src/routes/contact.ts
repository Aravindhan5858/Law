import { Router, Request, Response } from 'express';

const router = Router();

// Simple contact endpoint - logs to console. Can be extended to persist.
router.post('/', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });
  console.log('[contact] received:', { name, email, message });
  // TODO: persist to DB or send email
  res.json({ status: 'ok', message: 'Thanks — we received your message.' });
});

export default router;
