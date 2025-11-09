import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import analyzeRouter from './routes/analyze';
import lawsRouter from './routes/laws';
import contactRouter from './routes/contact';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/analyze', analyzeRouter);
app.use('/api/laws', lawsRouter);
app.use('/api/contact', contactRouter);

export default app;
