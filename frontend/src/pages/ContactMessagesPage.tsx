import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

type Status = 'New' | 'Read' | 'Replied' | 'Closed';
interface ContactMessage {
  messageId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: Status;
  notificationStatus: 'Pending' | 'Sent' | 'Failed';
  createdAt: string;
}

export default function ContactMessagesPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [error, setError] = useState('');
  const [newCount, setNewCount] = useState(0);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const updateToken = (nextToken: string) => {
    setToken(nextToken);
    sessionStorage.setItem('adminToken', nextToken);
    window.dispatchEvent(new Event('admin-token-updated'));
  };

  async function loadMessages() {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contact-messages`, { headers, params: { search, status } });
      setMessages(response.data.messages);
      setNewCount(response.data.newCount);
      setError('');
      window.dispatchEvent(new Event('admin-token-updated'));
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || 'Unable to load messages.' : 'Unable to load messages.');
    }
  }

  useEffect(() => {
    void loadMessages();
    if (!token) return undefined;
    const interval = window.setInterval(() => void loadMessages(), 30000);
    return () => window.clearInterval(interval);
  }, [token, search, status]);

  async function updateStatus(messageId: string, nextStatus: Status) {
    await axios.patch(`${API_BASE_URL}/admin/contact-messages/${messageId}/status`, { status: nextStatus }, { headers });
    await loadMessages();
    if (selected?.messageId === messageId) setSelected(current => current ? { ...current, status: nextStatus } : current);
  }

  async function remove(messageId: string) {
    if (!window.confirm('Delete this contact message permanently?')) return;
    await axios.delete(`${API_BASE_URL}/admin/contact-messages/${messageId}`, { headers });
    setSelected(null);
    await loadMessages();
  }

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Contact Messages {newCount > 0 && <span aria-label={`${newCount} new messages`}>({newCount} new)</span>}</h1>
        <p>Review and manage messages submitted by users.</p>
      </div>
      <section className="contact-form" style={{ maxWidth: '1100px', margin: '2rem auto' }}>
        <label htmlFor="admin-token">Admin JWT token</label>
        <input id="admin-token" className="form-input" type="password" value={token} onChange={event => updateToken(event.target.value)} placeholder="Paste an admin bearer token" />
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
          <input className="form-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email or subject" />
          <select className="form-input" value={status} onChange={event => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option>New</option><option>Read</option><option>Replied</option><option>Closed</option>
          </select>
        </div>
        {error && <p role="alert" style={{ color: 'var(--error-color, #b91c1c)' }}>{error}</p>}
        <p>Total: {messages.length} | New: {newCount} | Unread: {newCount}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Message ID</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{messages.map(message => (
              <tr key={message.messageId}>
                <td>{message.messageId}</td><td>{message.fullName}</td><td>{message.email}</td><td>{message.subject}</td>
                <td>{new Date(message.createdAt).toLocaleString()}</td><td>{message.status}</td>
                <td><button type="button" onClick={() => setSelected(message)}>View</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {selected && (
          <article style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border-color, #ddd)' }}>
            <h2>{selected.subject}</h2>
            <p><strong>{selected.fullName}</strong> · {selected.email} · {selected.phone}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {(['Read', 'Replied', 'Closed'] as Status[]).map(nextStatus => (
                <button type="button" key={nextStatus} onClick={() => void updateStatus(selected.messageId, nextStatus)}>{nextStatus}</button>
              ))}
              <button type="button" onClick={() => void remove(selected.messageId)}>Delete</button>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
