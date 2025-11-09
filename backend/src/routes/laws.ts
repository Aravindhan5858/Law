import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { simpleMatch } from '../services/matcherService';

const router = Router();

const SEED_PATH = path.resolve(__dirname, '..', '..', 'data', 'ipc_seed.json');
const CASES_PATH = path.resolve(__dirname, '..', '..', 'data', 'cases.json');

function loadSeed() {
  const out: any[] = [];
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) out.push(...parsed);
  } catch (e) {
    // ignore
  }

  try {
    const raw2 = fs.readFileSync(CASES_PATH, 'utf-8');
    const parsed2 = JSON.parse(raw2);
    if (Array.isArray(parsed2)) {
      // merge but prefer entries from cases.json (override seed by id)
      const byId: Record<string, any> = {};
      out.forEach((o: any) => { byId[String(o.id)] = o; });
      parsed2.forEach((c: any) => { byId[String(c.id)] = { ...(byId[String(c.id)] || {}), ...c }; });
      return Object.values(byId).sort((a: any, b: any) => Number(a.id) - Number(b.id));
    }
  } catch (e) {
    // ignore
  }

  return out;
}

// Search IPC sections by query (q) or section number
router.get('/', (req: Request, res: Response) => {
  const rawQ = String(req.query.q || '').trim();
  const q = rawQ.toLowerCase();
  const section = req.query.section ? Number(req.query.section) : undefined;
  const data = loadSeed();

  // If section param provided, or q contains a numeric 'section' reference like 'section 352' or just '352',
  // return the single section detail (including a procedure suggestion if available from matcherService).
  const numericMatch = section || ((): number | undefined => {
    const m = rawQ.match(/(?:section\s*)?(\d{1,4})$/i);
    return m ? Number(m[1]) : undefined;
  })();

  if (numericMatch) {
    const found = data.find((d: any) => Number(d.id) === Number(numericMatch));
    if (!found) return res.status(404).json({ error: 'Section not found' });

    // try to enrich with procedure text from matcherService by running a targeted match
    try {
      const seedText = `${found.title} ${found.text} ${(found.tags || []).join(' ')}`;
      const recs = simpleMatch(seedText);
      const rec = recs.find(r => Number(r.ipc_section) === Number(found.id));
      if (rec && rec.procedure) {
        // attach procedure if not already present in seed
        (found as any).procedure = (found as any).procedure || rec.procedure;
      }
    } catch (e) {
      // ignore enrichment errors
    }

    return res.json({ count: 1, results: [found] });
  }

  let results = data;
  if (q) {
    results = data.filter((d: any) => {
      return (
        String(d.id).includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.text.toLowerCase().includes(q) ||
        (d.tags || []).join(' ').toLowerCase().includes(q)
      );
    });
  }

  res.json({ count: results.length, results });
});

// Get single section
router.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = loadSeed();
  const found = data.find((d: any) => Number(d.id) === id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.json(found);
});

// Analyze endpoint (POST /api/laws/analyze)
router.post('/analyze', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text is required' });

  const recommendations = simpleMatch(text);
  res.json({ query: text, recommendations, disclaimer: 'Informational only; not legal advice.' });
});

// Search endpoint returning a single case-like object for frontend convenience
// GET /api/laws/search?q=...
router.get('/search', (req: Request, res: Response) => {
  const rawQ = String(req.query.q || '').trim();
  if (!rawQ) return res.status(400).json({ message: 'q is required' });
  const q = rawQ.toLowerCase();

  const data = loadSeed();

  // helper to map entries to unified case object
  function toCaseObj(d: any) {
    return {
      caseTitle: d.title || d.caseTitle || `Section ${d.id}`,
      sections: d.sections ? d.sections : [`IPC ${d.id}`],
      description: d.description || d.text || '',
      punishment: d.punishment || '',
      procedure: d.procedure || '',
      raw: d,
    };
  }

  // numeric lookup (matches '420', 'ipc 420', 'section 420')
  const m = rawQ.match(/(?:ipc\s*)?(?:section\s*)?(\d{1,4})$/i);
  if (m) {
    const id = Number(m[1]);
    const found = data.find((d: any) => Number(d.id) === id);
    if (found) return res.json(toCaseObj(found));
  }

  // keyword search: title, description, tags, examples, sections
  const found = data.find((d: any) => {
    const title = String(d.title || d.caseTitle || '').toLowerCase();
    const desc = String(d.text || d.description || '').toLowerCase();
    const tags = (d.tags || []).join(' ').toLowerCase();
    const examples = (d.examples || []).join(' ').toLowerCase();
    const sections = (d.sections || [`IPC ${d.id}`]).join(' ').toLowerCase();
    return title.includes(q) || desc.includes(q) || tags.includes(q) || examples.includes(q) || sections.includes(q);
  });

  if (!found) return res.status(404).json({ message: 'No matching case or section found' });
  return res.json(toCaseObj(found));
});

export default router;
