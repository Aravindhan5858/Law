import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const result = (loc.state as any)?.result;

  if (!result) {
    return (
      <div className="app-container">
        <h2>No result to show</h2>
        <p>Please analyze a case first.</p>
        <button className="btn" onClick={() => navigate('/analyze')}>Go to Analyze</button>
      </div>
    );
  }

  const top = result.recommendations?.[0];

  return (
    <div className="app-container">
      <h1>Result</h1>

      {top ? (
        <div className="result">
          <h2>Section {top.ipc_section} — {top.title}</h2>
          <p><strong>Punishment:</strong> {top.punishment}</p>
          <p><strong>Confidence:</strong> {(top.confidence * 100).toFixed(0)}%</p>
          <p><strong>Rationale:</strong> {top.rationale}</p>
          <p><strong>Procedure:</strong> {top.procedure}</p>
        </div>
      ) : (
        <div className="result">
          <p>No clear match found. See full response below.</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
        <button className="btn" style={{ marginLeft: 8 }} onClick={() => navigate('/analyze')}>New Case</button>
      </div>
    </div>
  );
}
