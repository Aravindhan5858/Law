import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage';
import { sendContactNotification } from '../services/emailService';
import { validateContactInput } from '../services/contactValidation';
import { emitContactCreated } from '../services/realtimeService';

const router = Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again later.' },
});

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  const validation = validateContactInput(req.body as Record<string, unknown>);
  if (validation.error) return res.status(400).json({ error: validation.error });
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Contact service is temporarily unavailable' });
  }

  try {
    const contact = await ContactMessage.create({
      ...validation.input,
      messageId: `MSG-${randomUUID()}`,
      status: 'New',
      notificationStatus: 'Pending',
    });
    emitContactCreated(contact);

    try {
      await sendContactNotification(contact);
      contact.notificationStatus = 'Sent';
      await contact.save();
      return res.status(201).json({
        success: true,
        message: 'Your message has been submitted successfully. Our team will contact you soon.',
        messageId: contact.messageId,
      });
    } catch (emailError) {
      console.error('[Contact Email Notification Error]', emailError);
      contact.notificationStatus = 'Failed';
      await contact.save();
      return res.status(201).json({
        success: true,
        notificationFailed: true,
        message: 'Your message has been saved successfully. Email notification is temporarily unavailable.',
        messageId: contact.messageId,
      });
    }
  } catch (error) {
    console.error('[Contact Storage Error]', error);
    return res.status(500).json({ error: 'Unable to save your message' });
  }
});

export default router;
