import React from 'react';

export default function AboutPage() {
  return (
    <div className="app-container">
      <h1>About Legal Case Advisor</h1>
      <p>
        This project helps users identify likely applicable IPC sections and provides a suggested course of action. It uses a rule-based matcher and (optionally) an LLM fallback for ambiguous cases.
      </p>
      <h3>Data & References</h3>
      <ul>
        <li>Indian Penal Code (IPC)</li>
        <li>Code of Criminal Procedure (CrPC)</li>
        <li>Information Technology Act (for cyber offences)</li>
      </ul>
      <h3>Disclaimer</h3>
      <p>This tool is informational only and does not constitute legal advice. Consult a qualified lawyer for legal guidance.</p>
    </div>
  );
}
