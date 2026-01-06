'use client';

// Construction Leads Paywall - Updated Jan 2026 v2
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

  const sampleLeads = [
    { city: 'Nashville', address: '123 Broadway Ave', type: 'Commercial Renovation', value: '$250,000', contractor: 'ABC Construction' },
    { city: 'Austin', address: '456 Congress St', type: 'New Residential', value: '$450,000', contractor: 'XYZ Builders' },
    { city: 'Houston', address: '789 Main St', type: 'Multi-Family', value: '$2,500,000', contractor: 'Elite Development' },
    { city: 'Phoenix', address: '321 Central Ave', type: 'Commercial Build', value: '$1,200,000', contractor: 'Desert Contractors' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        marginBottom: '30px'
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

      {/* Sample Leads Table */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '1000px',
        width: '90%',
        overflowX: 'auto'
      }}>
        <h2 style={{
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1.8em'
        }}>
          Sample Leads Preview
        </h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: '#667eea',
              color: 'white'
            }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>City</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Address</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Value</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Contractor</th>
            </tr>
          </thead>
          <tbody>
            {sampleLeads.map((lead, idx) => (
              <tr key={idx} style={{
                background: idx % 2 === 0 ? '#f9f9f9' : 'white'
              }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.city}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.address}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.type}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.value}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.contractor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{
          color: '#999',
          fontSize: '0.9em',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          Full dataset includes hundreds of leads updated daily from Nashville, Austin, Houston, Phoenix, Charlotte, Chattanooga, and San Antonio.
        </p>
      </div>
    </div>
  );
}