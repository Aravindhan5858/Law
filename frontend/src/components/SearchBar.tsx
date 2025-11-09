import React, { useState } from 'react';
import axios from 'axios';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  async function doSearch() {
    setError('');
    setResult(null);
    if (!q || q.trim().length === 0) return setError('Please enter a search term');
    setLoading(true);
    try {
      const res = await axios.get('/api/laws/search', { params: { q } });
      setResult(res.data);
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) setError(e.response.data.message);
      else setError('Search failed');
    } finally {
      setLoading(false);
    }
  }

  const startSpeech = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition API not supported in this browser');
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);
    rec.onresult = (ev: any) => {
      const t = ev.results[0][0].transcript;
      setTranscript(t);
      setQ(t);
      setListening(false);
      doSearch();
    };
    rec.onerror = (err: any) => {
      console.error('Speech error', err);
      setListening(false);
      alert('Speech recognition error');
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search case or section (e.g. 420, online fraud)"
          style={{ padding: 8, flex: 1 }}
        />
        <button className="btn" onClick={doSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        <button className="btn" onClick={startSpeech} style={{ marginLeft: 6 }}>{listening ? 'Listening...' : '🎤 Voice Search'}</button>
      </div>

      {transcript && <div style={{ marginTop: 6, color: '#666' }}>Heard: "{transcript}"</div>}

      <div style={{ marginTop: 12 }}>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        {result ? (
          <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>{result.caseTitle}</h2>
            <p><b>Section:</b> {Array.isArray(result.sections) ? result.sections.join(', ') : result.sections}</p>
            <p><b>Description:</b> {result.description}</p>
            <p><b>Punishment:</b> {result.punishment}</p>
            {result.procedure && <p><b>Procedure:</b> {result.procedure}</p>}
          </div>
        ) : (!error && <div style={{ color: '#666' }}>No matching case or section found.</div>)}
      </div>
    </div>
  );
}
