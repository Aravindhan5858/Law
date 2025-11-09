import { Router, Request, Response } from 'express';
import { simpleMatch } from '../services/matcherService';

const router = Router();

// Admin: list/search IPC sections (stubbed to in-memory index for now)
router.get('/', (_req: Request, res: Response) => {
  // In a full implementation this would query the DB
  res.json({ message: 'Admin IPC list endpoint — implement DB-backed listing' });
});

// Admin: add or update an IPC section (stub)
router.post('/', (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Create/update IPC (stub) — implement DB create/update' });
});

export default router;
