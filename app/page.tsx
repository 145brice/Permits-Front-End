'use client';

// Construction Leads Paywall - Updated Jan 2026 v2
import Nav from './components/Nav';

export default function Home() {
  const sampleLeads = [
    { date: '2025-12-09', city: 'Austin', type: 'Building Permit', number: '2025-153294', address: '38XX XXXXXX ST', description: 'AT&T Tower Modification - Install mount modification & Air Antennas' },
    { date: '2025-12-08', city: 'Austin', type: 'Electrical Permit', number: '2025-153409', address: '15XX XXXXXXX AVE', description: 'Whole home generator installation' },
    { date: '2015-02-08', city: 'Houston', type: 'New Single Family Dwelling', number: '1', address: '11XX W 26TH ST', description: 'New S.F. Residence w/ Attached Garage (06 IRC)' },
    { date: '2025-12-08', city: 'Austin', type: 'Plumbing Permit', number: '2025-153136', address: '80XX RUNNING XXXXX DR', description: 'Excavate tunnel to repair drain line under house' },
    { date: '2015-09-24', city: 'Houston', type: 'New Single Family Dwelling', number: '7', address: '42XX XXXX ST', description: 'New Det. Res Garage w/ Quarters Above (06 IRC)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
      paddingTop: '220px',
      position: 'relative'
    }}>
      <Nav />

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
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>City</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Permit #</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Address</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {sampleLeads.map((lead, idx) => (
              <tr key={idx} style={{
                background: idx % 2 === 0 ? '#f9f9f9' : 'white'
              }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{lead.date}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.city}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.type}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{lead.number}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontStyle: 'italic', color: '#999' }}>{lead.address}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.9em' }}>{lead.description}</td>
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