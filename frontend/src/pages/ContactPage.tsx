import React, { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function submit() {
    try {
      await axios.post('/api/contact', { name, email, message });
      alert('Thanks — we received your message.');
      setName(''); setEmail(''); setMessage('');
    } catch (e) {
      alert('Failed to send message');
    }
  }

  return (
    <div className="app-container">
      <h1>Contact / Feedback</h1>
      <div style={{ marginTop: 8 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ padding: 8, width: '100%', marginBottom: 8 }} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ padding: 8, width: '100%', marginBottom: 8 }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" rows={6} style={{ padding: 8, width: '100%', marginBottom: 8 }} />
        <div>
          <button className="btn" onClick={submit}>Send</button>
        </div>
      </div>
    </div>
  );
}
