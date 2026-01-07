'use client';

import Nav from './components/Nav';

export default function Home() {
  const handleGetStarted = () => {
    window.location.href = '/pricing';
  };

  const stats = [
    { number: '300-700', label: 'Daily Leads' },
    { number: '7', label: 'Major Cities' },
    { number: '24/7', label: 'Auto Updates' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Fresh Daily Updates',
      description: 'Get new construction permit leads delivered every single day. Never miss an opportunity.'
    },
    {
      icon: '🎯',
      title: 'Pre-Qualified Leads',
      description: 'Every lead includes property address, permit type, and project description to help you qualify instantly.'
    },
    {
      icon: '📊',
      title: 'CSV Download',
      description: 'Import leads directly into your CRM. Clean, organized data ready for your workflow.'
    },
    {
      icon: '🏗️',
      title: 'Multiple Permit Types',
      description: 'Building, electrical, plumbing, mechanical permits and more. Target your exact niche.'
    },
    {
      icon: '🗺️',
      title: 'Interactive Map View',
      description: 'Visualize leads geographically. Plan your route and territory efficiently.'
    },
    {
      icon: '💰',
      title: 'Unlimited Access',
      description: 'Download as many times as you want. No caps, no limits, no restrictions.'
    }
  ];

  const sampleLeads = [
    { date: '2025-12-09', city: 'Austin', type: 'Building Permit', address: '38XX XXXXXX ST', value: 'Commercial Tower' },
    { date: '2025-12-08', city: 'Austin', type: 'Electrical', address: '15XX XXXXXXX AVE', value: 'Whole Home Generator' },
    { date: '2025-12-08', city: 'Austin', type: 'Plumbing', address: '80XX RUNNING DR', value: 'Repair/Renovation' }
  ];

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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '220px 40px 80px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(2.5em, 5vw, 4em)',
          marginBottom: '25px',
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          Stop Chasing Leads.<br/>Start Closing Them.
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: 'clamp(1.1em, 2.5vw, 1.4em)',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Get fresh construction permit leads delivered daily. Every homeowner, every renovation, every new build—before your competition even knows about it.
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: '18px 50px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
            marginBottom: '30px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
          }}
        >
          Get Started - $99/Month
        </button>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.95em'
        }}>
          ✓ Cancel anytime  ✓ Instant access  ✓ No credit card required to view sample
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginTop: '60px',
          maxWidth: '800px',
          margin: '60px auto 0'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '30px 20px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                fontSize: '2.5em',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>
                {stat.number}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.1em'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
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
            marginBottom: '20px'
          }}>
            Everything You Need to Win More Business
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.2em',
            color: '#666',
            marginBottom: '60px',
            maxWidth: '600px',
            margin: '0 auto 60px'
          }}>
            Stop wasting time on cold calls and door knocking. Get warm leads ready to convert.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{
                padding: '30px',
                borderRadius: '15px',
                background: '#f9f9f9',
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
                <div style={{
                  fontSize: '3em',
                  marginBottom: '15px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4em',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
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
            Real permit data from today. Updated every 24 hours.
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
                <tr style={{
                  background: '#667eea',
                  color: 'white'
                }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>City</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>Project</th>
                </tr>
              </thead>
              <tbody>
                {sampleLeads.map((lead, idx) => (
                  <tr key={idx} style={{
                    background: idx % 2 === 0 ? '#f9f9f9' : 'white',
                    borderBottom: idx === sampleLeads.length - 1 ? 'none' : '1px solid #eee'
                  }}>
                    <td style={{ padding: '15px', color: '#333', fontWeight: '500' }}>{lead.date}</td>
                    <td style={{ padding: '15px', color: '#667eea', fontWeight: 'bold' }}>{lead.city}</td>
                    <td style={{ padding: '15px', color: '#666' }}>{lead.type}</td>
                    <td style={{ padding: '15px', color: '#999', fontStyle: 'italic' }}>{lead.address}</td>
                    <td style={{ padding: '15px', color: '#333' }}>{lead.value}</td>
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
              Full access includes 300-700 leads per day across all cities • Complete property details • Export to CSV
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
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
            fontSize: '1.2em',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Join contractors who are already closing more deals with fresh, daily construction leads.
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '18px 50px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.3em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }}
          >
            Start Your Free Trial
          </button>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.95em',
            marginTop: '20px'
          }}>
            No contracts. Cancel anytime. Get instant access.
          </p>
        </div>
      </div>
    </div>
  );
}