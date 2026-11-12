import nodemailer from 'nodemailer';
import { ContactMessageDocument } from '../models/ContactMessage';

function getTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email credentials are not configured');
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: Number(EMAIL_PORT || 465),
    secure: EMAIL_SECURE !== 'false',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

export async function sendContactNotification(contact: ContactMessageDocument) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error('ADMIN_EMAIL is not configured');

  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: adminEmail,
    replyTo: contact.email,
    subject: 'New Contact Message Received – Legal Case Advisor',
    text: [
      'A new contact message has been submitted through the Legal Case Advisor website.',
      '',
      'Message Details:',
      `- Message ID: ${contact.messageId}`,
      `- Name: ${contact.fullName}`,
      `- Email: ${contact.email}`,
      `- Phone: ${contact.phone}`,
      `- Subject: ${contact.subject}`,
      `- Message: ${contact.message}`,
      `- Submitted Date: ${contact.createdAt.toISOString()}`,
      '',
      'Please log in to the Admin Dashboard to review this message.',
    ].join('\n'),
  });
}
