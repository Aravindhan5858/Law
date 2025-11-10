import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit() {
    setLoading(true);
    try {
      const body = { text: text.replace(/[“”‘’]/g, '"').trim() };
      const res = await axios.post('/api/laws/analyze', body);
      // navigate to result with state
      navigate('/result', { state: { result: res.data } });
    } catch (err: any) {
      console.error(err);
      alert('Failed to analyze. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h1>Describe your issue</h1>
      <div className="input-area">
        <textarea
          className="input-text"
          placeholder="Describe the incident briefly, e.g. 'Someone hit me in public'"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="controls">
        <button className="btn" onClick={submit} disabled={loading || text.trim().length < 3}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}
