import React from 'react';

export const PlaceholderPage = ({ title }) => {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)' }}>This page is currently under construction for Phase 1.</p>
    </div>
  );
};
