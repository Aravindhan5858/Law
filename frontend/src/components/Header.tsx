import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ background: 'white', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: '#111' }}><strong>Legal Case Advisor</strong></Link>
        </div>
        <nav>
          <Link to="/laws" style={{ marginRight: 12 }}>Laws</Link>
          <Link to="/analyze" style={{ marginRight: 12 }}>Analyze</Link>
          <Link to="/about" style={{ marginRight: 12 }}>About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
