type Recommendation = {
  ipc_section: number;
  title: string;
  punishment: string;
  rationale: string;
  confidence: number;
  procedure?: string;
};

// Improved in-memory IPC index for common cases (expandable)
const IPC_INDEX = [
  {
    id: 420,
    title: 'Cheating',
    punishment: 'Rigorous imprisonment and/or fine (Section 420 IPC)',
    tags: ['cheat', 'cheating', 'scam', 'fraud', 'swindle', 'defraud', 'fake website', 'online scam', 'paid', 'payment', 'money', 'transaction', 'did not receive', 'not received', 'no delivery', 'not delivered', 'website not responding', 'no response', 'seller not responding']
  },
  {
    id: 406,
    title: 'Criminal breach of trust',
    punishment: 'Imprisonment and/or fine (Section 406 IPC)',
    tags: ['breach of trust', 'breach trust', 'betray', 'misappropriate', 'trusted', 'trusted to', 'entrusted']
  },
  {
    id: 352,
    title: 'Assault',
    punishment: 'Imprisonment up to 3 months, fine, or both',
    tags: ['hit', 'assault', 'punch', 'slap', 'beating']
  },
  {
    id: 323,
    title: 'Voluntarily causing hurt',
    punishment: 'Imprisonment up to 1 year or fine or both',
    tags: ['hurt', 'injury', 'injure', 'beat']
  },
  {
    id: 506,
    title: 'Criminal intimidation',
    punishment: 'Imprisonment up to 2 years or fine or both',
    tags: ['threat', 'threaten', 'intimidate']
  }
];

function normalizeText(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[“”‘’‚‛‹›«»]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^a-z0-9\s\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function simpleMatch(text: string): Recommendation[] {
  const normalized = normalizeText(text);
  const results: Recommendation[] = [];

  for (const item of IPC_INDEX) {
    let score = 0;
    let matched: string[] = [];
    for (const tag of item.tags) {
      const t = tag.toLowerCase();
      // treat multi-word phrases more strongly
      if (t.includes(' ') || t.includes('-')) {
        if (normalized.includes(t)) {
          score += 2; // phrase match weight
          matched.push(tag);
        }
      } else {
        if (normalized.split(' ').includes(t)) {
          score += 1;
          matched.push(tag);
        } else if (normalized.includes(t)) {
          // substring match
          score += 0.6;
          matched.push(tag);
        }
      }
    }

    if (matched.length > 0) {
      // normalize confidence between 0 and 1
      const maxPossible = item.tags.length * 2; // optimistic
      const confidence = Math.min(1, score / Math.max(1, maxPossible));
      const procedure = item.id === 420
        ? 'Suggested action: File a police complaint (FIR) for cheating (IPC 420). Collect transaction proofs, screenshots, bank statements, and attempt contact followed by a written notice.'
        : item.id === 406
        ? 'Suggested action: Consider civil claim and FIR if funds were entrusted and misappropriated. Collect proof of entrustment (receipts, contracts).' 
        : 'Suggested action: Consult a lawyer and consider filing an FIR if appropriate.';

      results.push({
        ipc_section: item.id,
        title: item.title,
        punishment: item.punishment,
        rationale: `Matched tags: ${matched.join(', ')}`,
        confidence,
        procedure
      });
    }
  }

  // sort by confidence desc
  results.sort((a, b) => b.confidence - a.confidence);

  if (results.length === 0) {
    return [
      {
        ipc_section: 0,
        title: 'Not identified',
        punishment: 'N/A',
        rationale: 'No direct match found. Consider adding more details (payment method, seller contact, delivery attempts).',
        confidence: 0,
        procedure: 'If you suspect fraud, collect all transaction evidence and consult local police or a lawyer.'
      }
    ];
  }

  return results;
}
