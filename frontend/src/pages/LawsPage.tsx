import React from 'react';
import SearchBar from '../components/SearchBar';

export default function LawsPage() {
  return (
    <div className="app-container">
      <h1>Law Search</h1>
      <div style={{ marginTop: 8 }}>
        <SearchBar />
      </div>
    </div>
  );
}
