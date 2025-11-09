import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="app-container">
      <h1>Legal Case Advisor</h1>
      <p>Know Your Law in Seconds — enter a short description of your problem and get suggested IPC sections, punishments, and next steps.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/analyze"><button className="btn">Get Started</button></Link>
      </div>
      <div style={{ marginTop: 18 }}>
        <h3>How it works</h3>
        <ol>
          <li>Describe your incident in plain language.</li>
          <li>Our matcher suggests likely IPC sections and actions.</li>
          <li>Consult a lawyer or file a police complaint if needed.</li>
        </ol>
      </div>
    </div>
  );
}
