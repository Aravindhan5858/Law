import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();
router.use(requireAdmin);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
    const newCount = await ContactMessage.countDocuments({ status: 'New' });
    return res.json({ messages, total: messages.length, newCount, unreadCount: newCount });
  } catch (error) {
    console.error('[Admin Contact List Error]', error);
    return res.status(500).json({ error: 'Unable to retrieve contact messages' });
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
      { status },
      { new: true, runValidators: true },
    ).lean();
    if (!message) return res.status(404).json({ error: 'Contact message not found' });
    return res.json({ success: true, message });
  } catch (error) {
    console.error('[Admin Contact Status Error]', error);
    return res.status(500).json({ error: 'Unable to update contact message' });
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
