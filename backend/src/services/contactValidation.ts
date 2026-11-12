export interface ContactInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export function validateContactInput(body: Record<string, unknown>): { input?: ContactInput; error?: string } {
  const input = {
    fullName: typeof body.fullName === 'string' ? body.fullName.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
    subject: typeof body.subject === 'string' ? body.subject.trim() : '',
    message: typeof body.message === 'string' ? body.message.trim() : '',
  };
  if (!input.fullName || !input.email || !input.phone || !input.subject || !input.message) {
    return { error: 'Full name, email, phone, subject, and message are required' };
  }
  if (!emailPattern.test(input.email)) return { error: 'Please provide a valid email address' };
  if (!phonePattern.test(input.phone)) return { error: 'Please provide a valid phone number' };
  if (input.message.length < 20) return { error: 'Message must be at least 20 characters' };
  return { input };
}
