'use client';

// Construction Leads Paywall - Updated Jan 2026
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/leads?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads.csv';
        a.click();
        alert('Download started!');
      } else {
        const error = await response.json();
        alert(error.error || 'Access denied');
      }
    } catch (err) {
      alert('Error downloading leads');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2.5em'
        }}>
          Construction Leads
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '1.1em'
        }}>
          Get access to fresh construction permit leads across major cities.
          Download today's leads with just your email.
        </p>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              marginBottom: '15px',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleDownload}
            disabled={loading || !email}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {loading ? 'Downloading...' : 'Download Today\'s Leads'}
          </button>
        </div>
        <p style={{
          color: '#999',
          fontSize: '0.9em',
          marginTop: '20px'
        }}>
          Access granted for active subscribers and recent payers.
        </p>
      </div>
    </div>
  );
}