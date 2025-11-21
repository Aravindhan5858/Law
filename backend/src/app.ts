import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import analyzeRouter from './routes/analyze';
import contactRouter from './routes/contact';
import searchRouter from './routes/search';
import legalAnalysisRouter from './routes/legalAnalysis';
import { initializeSearchEngine } from './services/searchInitializer';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Initialize search engine on startup
initializeSearchEngine().catch((err: Error) => {
  console.error('[App] Failed to initialize search engine:', err);
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/analyze', analyzeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/search', searchRouter);
app.use('/api/legal-analysis', legalAnalysisRouter);

export default app;
