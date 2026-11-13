import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage';
import { requireAdmin } from '../middleware/authMiddleware';
import { emitContactUpdated } from '../services/realtimeService';

const router = Router();
router.use(requireAdmin);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const unreadQuery = { $or: [{ isRead: false }, { isRead: { $exists: false }, status: 'New' }] };

router.get('/', async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database unavailable' });
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const query: Record<string, unknown> = {};
  if (status && ['New', 'Read', 'Replied', 'Closed'].includes(status)) query.status = status;
  if (search) {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { fullName: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
      { subject: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  try {
    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).lean();
    const newCount = await ContactMessage.countDocuments(unreadQuery);
    return res.json({ messages, total: messages.length, newCount, unreadCount: newCount });
  } catch (error) {
    console.error('[Admin Contact List Error]', error);
    return res.status(500).json({ error: 'Unable to retrieve contact messages' });
  }
});

router.get('/unread-count', async (_req: Request, res: Response) => {
  try {
    const count = await ContactMessage.countDocuments(unreadQuery);
    return res.json({ unreadCount: count });
  } catch (error) {
    console.error('[Admin Contact Unread Count Error]', error);
    return res.status(500).json({ error: 'Unable to retrieve unread contact count' });
  }
});

router.get('/recent', async (req: Request, res: Response) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ messages });
  } catch (error) {
    console.error('[Admin Recent Contacts Error]', error);
    return res.status(500).json({ error: 'Unable to retrieve recent contact messages' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findOne({ messageId: req.params.id }).lean();
    if (!message) return res.status(404).json({ error: 'Contact message not found' });
    return res.json({ message });
  } catch (error) {
    console.error('[Admin Contact Detail Error]', error);
    return res.status(500).json({ error: 'Unable to retrieve contact message' });
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  const status = req.body?.status;
  if (!['New', 'Read', 'Replied', 'Closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid message status' });
  }
  try {
    const message = await ContactMessage.findOneAndUpdate(
      { messageId: req.params.id },
      { status, isRead: status !== 'New' },
      { new: true, runValidators: true },
    ).lean();
    if (!message) return res.status(404).json({ error: 'Contact message not found' });
    emitContactUpdated(message);
    return res.json({ success: true, message });
  } catch (error) {
    console.error('[Admin Contact Status Error]', error);
    return res.status(500).json({ error: 'Unable to update contact message' });
  }
});

router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findOneAndUpdate(
      { messageId: req.params.id },
      { isRead: true, status: 'Read' },
      { new: true, runValidators: true },
    ).lean();
    if (!message) return res.status(404).json({ error: 'Contact message not found' });
    emitContactUpdated(message);
    return res.json({ success: true, message });
  } catch (error) {
    console.error('[Admin Contact Read Error]', error);
    return res.status(500).json({ error: 'Unable to mark contact message as read' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await ContactMessage.deleteOne({ messageId: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ error: 'Contact message not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error('[Admin Contact Delete Error]', error);
    return res.status(500).json({ error: 'Unable to delete contact message' });
  }
});

export default router;
