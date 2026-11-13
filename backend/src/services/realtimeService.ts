import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ContactMessageDocument } from '../models/ContactMessage';

let io: Server | null = null;

export function initializeRealtime(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || true,
    },
  });

  io.use((socket, next) => {
    const secret = process.env.ADMIN_JWT_SECRET;
    const token = socket.handshake.auth?.token;
    if (!secret || typeof token !== 'string') {
      return next(new Error('Admin authentication required'));
    }

    try {
      const payload = jwt.verify(token, secret);
      if (typeof payload !== 'object' || (payload.role !== 'admin' && payload.isAdmin !== true)) {
        return next(new Error('Admin access required'));
      }
      return next();
    } catch {
      return next(new Error('Invalid or expired admin token'));
    }
  });

  io.on('connection', socket => {
    socket.join('admins');
  });

  return io;
}

export function emitContactCreated(contact: ContactMessageDocument) {
  if (!io) return;
  io.to('admins').emit('contact:created', {
    messageId: contact.messageId,
    fullName: contact.fullName,
    subject: contact.subject,
    message: contact.message,
    createdAt: contact.createdAt,
    isRead: contact.isRead,
  });
}

export function emitContactUpdated(contact: ContactMessageDocument) {
  io?.to('admins').emit('contact:updated', {
    messageId: contact.messageId,
    isRead: contact.isRead,
    status: contact.status,
  });
}
