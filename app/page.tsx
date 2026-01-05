'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleDownload = async () => {
    const response = await fetch(`/api/leads?email=${encodeURIComponent(email)}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
    } else {
      alert('Access denied or error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Download Today's Leads</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleDownload}>Download Today's Leads</button>
    </div>
  );
}