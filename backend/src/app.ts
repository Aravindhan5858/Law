import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import analyzeRouter from './routes/analyze';
import contactRouter from './routes/contact';
import searchRouter from './routes/search';
import legalAnalysisRouter from './routes/legalAnalysis';
import assaultAssistantRouter from './routes/assaultAssistant';
import complaintsRouter from './routes/complaints';
import { initializeSearchEngine } from './services/searchInitializer';
import adminContactRouter from './routes/adminContact';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '100kb' }));

// Initialize search engine on startup
initializeSearchEngine().catch((err: Error) => {
  console.error('[App] Failed to initialize search engine:', err);
});

app.get('/', (_req, res) => {
  res.json({
    name: 'Legal Case Advisor API',
    status: 'ok',
    health: '/api/health',
  });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/analyze', analyzeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin/contact-messages', adminContactRouter);
app.use('/api/search', searchRouter);
app.use('/api/legal-analysis', legalAnalysisRouter);
app.use('/api/assault-assistant', assaultAssistantRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api', complaintsRouter);

export default app;
