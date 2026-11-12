import { Schema, model } from 'mongoose';

const contactMessageSchema = new Schema(
  {
    messageId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ['New', 'Read', 'Replied', 'Closed'], default: 'New', index: true },
    notificationStatus: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
  },
  { timestamps: true, versionKey: false },
);

export interface ContactMessageDocument {
  messageId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Closed';
  notificationStatus: 'Pending' | 'Sent' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

export default model<ContactMessageDocument>('ContactMessage', contactMessageSchema);
