import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      await axios.post('/api/contact', { name, email, message });
      alert('Thanks — we received your message.');
      setName(''); 
      setEmail(''); 
      setMessage('');
    } catch (e) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ maxWidth: '600px', margin: '2rem auto' }}
      >
        <div className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input 
              id="name"
              type="text"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="your.email@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message"
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Tell us how we can help you..."
              rows={6}
              className="form-textarea"
            />
          </div>

          <button 
            className="btn btn-primary btn-large" 
            onClick={submit}
            disabled={sending}
          >
            {sending ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </div>

        <div className="contact-info" style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Other Ways to Reach Us</h3>
          <div className="info-cards-grid">
            <div className="mini-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>support@legaladvisor.com</span>
            </div>
            <div className="mini-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 1800-123-4567</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
