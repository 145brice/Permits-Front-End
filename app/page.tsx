'use client';

import Nav from './components/Nav';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />

      {/* Hero Section */}
      <div style={{
        padding: '100px 20px 80px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(2.5em, 6vw, 4.5em)',
          fontWeight: 'bold',
          marginBottom: '25px',
          lineHeight: '1.1'
        }}>
          Stop Chasing Leads.<br/>Start Closing Them.
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: 'clamp(1.2em, 3vw, 1.5em)',
          marginBottom: '40px',
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.5'
        }}>
          Fresh construction permit leads delivered daily to your inbox. Every new build, renovation, and remodel—before your competition.
        </p>
        
        <button
          onClick={() => window.location.href = '/purchase'}
          style={{
            padding: '20px 60px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.4em',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
            marginBottom: '20px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
          }}
        >
          Get Started - $99/mo
        </button>
        
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '1em',
          marginTop: '15px'
        }}>
          ✓ No contracts ✓ Cancel anytime ✓ Instant access
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginTop: '60px',
          maxWidth: '900px',
          margin: '60px auto 0'
        }}>
          {[
            { num: '300-700', text: 'Fresh Leads Daily' },
            { num: '7', text: 'Major Cities' },
            { num: '24/7', text: 'Auto-Updated' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '30px 20px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                fontSize: '3em',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>{stat.num}</div>
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.1em'
              }}>{stat.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{
        background: 'white',
        padding: '80px 40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5em',
            color: '#333',
            marginBottom: '60px'
          }}>
            Everything You Need to Win More Business
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {[
              { icon: '⚡', title: 'Fresh Daily Data', desc: 'New permits added every 24 hours. Never miss an opportunity.' },
              { icon: '🎯', title: 'Pre-Qualified', desc: 'Full property details, permit type, and project scope included.' },
              { icon: '📊', title: 'CSV Download', desc: 'Import directly into any CRM. Clean, organized, ready to use.' },
              { icon: '🗺️', title: 'Map View', desc: 'See all leads on an interactive map. Plan your territory efficiently.' },
              { icon: '🏗️', title: 'All Permit Types', desc: 'Building, electrical, plumbing, mechanical, and more.' },
              { icon: '💰', title: 'Unlimited Access', desc: 'Download as many times as you want. No restrictions.' }
            ].map((f, i) => (
              <div key={i} style={{
                padding: '30px',
                background: '#f9f9f9',
                borderRadius: '15px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '3em', marginBottom: '15px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Preview */}
      <div style={{
        background: '#f5f5f5',
        padding: '80px 40px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5em',
            color: '#333',
            marginBottom: '20px'
          }}>
            See What You'll Get
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.2em',
            color: '#666',
            marginBottom: '40px'
          }}>
            Real permit data from today
          </p>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0'
            }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>City</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>Project</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2025-12-09', city: 'Austin', type: 'Building', addr: '38XX XXXXXX ST', proj: 'Commercial Tower' },
                  { date: '2025-12-08', city: 'Austin', type: 'Electrical', addr: '15XX XXXXXXX AVE', proj: 'Home Generator' },
                  { date: '2025-12-08', city: 'Austin', type: 'Plumbing', addr: '80XX RUNNING DR', proj: 'Renovation' }
                ].map((lead, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{lead.date}</td>
                    <td style={{ padding: '15px', color: '#667eea', fontWeight: 'bold' }}>{lead.city}</td>
                    <td style={{ padding: '15px', color: '#666' }}>{lead.type}</td>
                    <td style={{ padding: '15px', color: '#999', fontStyle: 'italic' }}>{lead.addr}</td>
                    <td style={{ padding: '15px' }}>{lead.proj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{
              marginTop: '30px',
              textAlign: 'center',
              color: '#999',
              fontSize: '0.95em'
            }}>
              Full access: 300-700 leads/day • All cities • Complete details • CSV export
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div style={{
        background: 'white',
        padding: '80px 40px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            padding: '50px',
            textAlign: 'center',
            color: 'white'
          }}>
            <p style={{
              fontSize: '1.5em',
              fontStyle: 'italic',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              "We closed 3 kitchen remodels in the first week. Already paid for itself 10x over."
            </p>
            <p style={{
              fontSize: '1.2em',
              opacity: 0.9
            }}>
              — Mike T., Electrical Contractor
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '2.5em',
          marginBottom: '20px'
        }}>
          Ready to 10X Your Lead Flow?
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '1.3em',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          Join contractors already closing more deals
        </p>
        <button
          onClick={() => window.location.href = '/purchase'}
          style={{
            padding: '20px 60px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.4em',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
          }}
        >
          Get Started Now
        </button>
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '1em',
          marginTop: '20px'
        }}>
          No contracts. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

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
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <Nav />

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