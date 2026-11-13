import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, SOCKET_URL } from '../config/api';

interface NotificationMessage {
  messageId: string;
  fullName: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  status?: string;
}

function headers(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const updateToken = () => setToken(sessionStorage.getItem('adminToken') || '');
    window.addEventListener('admin-token-updated', updateToken);
    window.addEventListener('storage', updateToken);
    return () => {
      window.removeEventListener('admin-token-updated', updateToken);
      window.removeEventListener('storage', updateToken);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setMessages([]);
      setUnreadCount(0);
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    let active = true;
    const refreshUnreadCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/contact-messages/unread-count`, { headers: headers(token) });
        if (active) setUnreadCount(response.data.unreadCount);
      } catch {
        if (active) setError('Unable to refresh notification count.');
      }
    };
    const loadNotifications = async () => {
      try {
        const [countResponse, recentResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/contact-messages/unread-count`, { headers: headers(token) }),
          axios.get(`${API_BASE_URL}/admin/contact-messages/recent?limit=10`, { headers: headers(token) }),
        ]);
        if (!active) return;
        setUnreadCount(countResponse.data.unreadCount);
        setMessages(recentResponse.data.messages);
        setError('');
      } catch (requestError) {
        if (!active) return;
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || 'Unable to load notifications.' : 'Unable to load notifications.');
      }
    };

    void loadNotifications();
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;
    socket.on('connect_error', () => {
      if (active) setError('Live notifications are unavailable.');
    });
    socket.on('contact:created', (message: NotificationMessage) => {
      if (!active) return;
      setMessages(current => [message, ...current.filter(item => item.messageId !== message.messageId)].slice(0, 10));
      setUnreadCount(current => current + 1);
      setError('');
    });
    socket.on('contact:updated', (update: Pick<NotificationMessage, 'messageId' | 'isRead' | 'status'>) => {
      if (!active) return;
      setMessages(current => current.map(message => message.messageId === update.messageId ? { ...message, ...update } : message));
      void refreshUnreadCount();
    });

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  async function markAsRead(message: NotificationMessage) {
    if (!message.isRead) {
      try {
        await axios.patch(`${API_BASE_URL}/admin/contact-messages/${message.messageId}/read`, {}, { headers: headers(token) });
        setMessages(current => current.map(item => item.messageId === message.messageId ? { ...item, isRead: true, status: 'Read' } : item));
        setUnreadCount(current => Math.max(0, current - 1));
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || 'Unable to mark notification as read.' : 'Unable to mark notification as read.');
        return;
      }
    }
    setIsOpen(false);
    navigate('/admin/contact-messages');
  }

  if (!token) return null;

  return (
    <div className="notification-bell">
      <button type="button" className="notification-bell-button" onClick={() => setIsOpen(current => !current)} aria-label={`${unreadCount} unread contact notifications`} aria-expanded={isOpen}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notification-popup" role="dialog" aria-label="Contact notifications">
          <div className="notification-popup-header">
            <strong>Contact messages</strong>
            <button type="button" onClick={() => navigate('/admin/contact-messages')}>View all</button>
          </div>
          {error && <p className="notification-error" role="alert">{error}</p>}
          {messages.length === 0 ? (
            <p className="notification-empty">No contact messages yet.</p>
          ) : (
            <div className="notification-list">
              {messages.map(message => (
                <button type="button" className={`notification-item ${message.isRead ? '' : 'unread'}`} key={message.messageId} onClick={() => void markAsRead(message)}>
                  <span className="notification-item-heading"><strong>{message.fullName}</strong>{!message.isRead && <span className="notification-unread-dot" aria-label="Unread" />}</span>
                  <span className="notification-item-subject">{message.subject}</span>
                  <span className="notification-item-preview">{message.message}</span>
                  <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
                  {!message.isRead && <span className="notification-mark-read">Mark as read</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
