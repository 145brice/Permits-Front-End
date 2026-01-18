'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [scrapersRunning, setScrapersRunning] = useState(false);
  const [permitsOn, setPermitsOn] = useState(true);
  const [soldOn, setSoldOn] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [leadsStructure, setLeadsStructure] = useState<any[]>([]);

  const backendUrl = 'https://permits-back-end.onrender.com';

  // Run scrapers
  const runScrapers = async () => {
    setScrapersRunning(true);
    try {
      const response = await fetch(`${backendUrl}/api/run-scrapers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Scrapers completed successfully!');
      } else {
        alert('Error running scrapers');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error running scrapers');
    } finally {
      setScrapersRunning(false);
    }
  };

  // Toggle permits
  const togglePermits = async () => {
    const newState = !permitsOn;
    try {
      const response = await fetch(`${backendUrl}/api/switch/permits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ on: newState }),
      });

      if (response.ok) {
        setPermitsOn(newState);
      } else {
        alert('Error toggling permits');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error toggling permits');
    }
  };

  // Toggle sold properties
  const toggleSold = async () => {
    const newState = !soldOn;
    try {
      const response = await fetch(`${backendUrl}/api/switch/sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ on: newState }),
      });

      if (response.ok) {
        setSoldOn(newState);
      } else {
        alert('Error toggling sold properties');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error toggling sold properties');
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/get-logs`);
      if (response.ok) {
        const text = await response.text();
        const lines = text.split('\n').slice(-20); // Get last 20 lines
        setLogs(lines);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Fetch leads structure
  const fetchLeadsStructure = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/get-leads-structure`);
      if (response.ok) {
        const data = await response.json();
        setLeadsStructure(data.cities || []);
      }
    } catch (error) {
      console.error('Error fetching leads structure:', error);
    }
  };

  // Fetch logs and leads structure every 10 seconds
  useEffect(() => {
    fetchLogs();
    fetchLeadsStructure();
    const interval = setInterval(() => {
      fetchLogs();
      fetchLeadsStructure();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '40px', fontSize: '2rem' }}>Admin Dashboard</h1>

      {/* Run Scrapers Button */}
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={runScrapers}
          disabled={scrapersRunning}
          style={{
            backgroundColor: scrapersRunning ? '#666' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '5px',
            cursor: scrapersRunning ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace'
          }}
        >
          {scrapersRunning ? 'Running...' : 'Run Scrapers Now'}
        </button>
      </div>

      {/* Toggle Switches */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
        {/* Permits Toggle */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Permits</div>
          <button
            onClick={togglePermits}
            style={{
              backgroundColor: permitsOn ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'monospace',
              minWidth: '120px'
            }}
          >
            {permitsOn ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Sold Properties Toggle */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Sold Properties</div>
          <button
            onClick={toggleSold}
            style={{
              backgroundColor: soldOn ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'monospace',
              minWidth: '120px'
            }}
          >
            {soldOn ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Leads Structure */}
      <div style={{ width: '80%', maxWidth: '800px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Saved Leads</h2>
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '5px',
          padding: '20px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          {leadsStructure.length > 0 ? (
            leadsStructure.map((city: any) => (
              <div key={city.name} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
                  📁 {city.name} ({city.dates.length} dates)
                </div>
                {city.dates.map((date: any) => (
                  <div key={date.date} style={{ marginLeft: '20px', marginBottom: '5px' }}>
                    📄 {date.date}: {date.permits} permits ({date.files} files)
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>No leads saved yet</div>
          )}
        </div>
      </div>

      {/* Logs Box */}
      <div style={{ width: '80%', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '20px' }}>Live Logs</h2>
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '5px',
          padding: '20px',
          height: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap'
        }}>
          {logs.length > 0 ? logs.join('\n') : 'Loading logs...'}
        </div>
      </div>
    </div>
  );
}