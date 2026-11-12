import React, { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const initialForm = { fullName: '', email: '', phone: '', subject: '', message: '' };

function validate(form: typeof initialForm): string {
  if (Object.values(form).some(value => !value.trim())) return 'Please complete all fields.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
  if (!/^\+?[0-9\s().-]{7,20}$/.test(form.phone)) return 'Please enter a valid phone number.';
  if (form.message.trim().length < 20) return 'Message must be at least 20 characters.';
  return '';
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setFeedback(null);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const error = validate(form);
    if (error) {
      setFeedback({ type: 'error', text: error });
      return;
    }

    setSending(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, form);
      setFeedback({ type: 'success', text: response.data.message });
      setForm(initialForm);
    } catch (requestError) {
      const message = axios.isAxiosError(requestError) && requestError.response?.data?.error
        ? requestError.response.data.error
        : 'Unable to submit your message right now. Please try again.';
      setFeedback({ type: 'error', text: message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="dashboard">
      <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We&apos;d love to hear from you.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <form className="contact-form" onSubmit={submit} noValidate>
          {([
            ['fullName', 'Full Name', 'text', 'Enter your full name'],
            ['email', 'Email Address', 'email', 'your.email@example.com'],
            ['phone', 'Phone Number', 'tel', '+91 98765 43210'],
            ['subject', 'Subject', 'text', 'How can we help?'],
          ] as const).map(([field, label, type, placeholder]) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{label}</label>
              <input
                id={field}
                type={type}
                value={form[field]}
                onChange={event => update(field, event.target.value)}
                placeholder={placeholder}
                className="form-input"
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={form.message}
              onChange={event => update('message', event.target.value)}
              placeholder="Tell us how we can help you..."
              rows={6}
              className="form-textarea"
              minLength={20}
              required
            />
          </div>
          {feedback && (
            <p role="status" style={{ color: feedback.type === 'success' ? 'var(--success-color, #15803d)' : 'var(--error-color, #b91c1c)' }}>
              {feedback.text}
            </p>
          )}
          <button className="btn btn-primary btn-large" type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Submit Message'}
          </button>
        </form>

        <div className="contact-info" style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Other Ways to Reach Us</h3>
          <div className="info-cards-grid">
            <div className="mini-card"><span>support@legaladvisor.com</span></div>
            <div className="mini-card"><span>+91 1800-123-4567</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
