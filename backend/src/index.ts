import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';

dotenv.config();

const port = process.env.PORT || 4000;

async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } else {
    console.warn('MONGODB_URI is not configured; contact storage is unavailable.');
  }

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start backend:', error);
  process.exitCode = 1;
});
