'use client';

import Nav from '../components/Nav';

export default function Pricing() {
  const handleSubscribe = () => {
    // Austin Stripe Payment Link
    window.location.href = 'https://buy.stripe.com/5kQ28t3vadGHfyyeTt63K0F';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2em'
          }}>
            Get unlimited access to fresh construction leads across all cities
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Monthly Plan */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '2em',
              marginBottom: '10px'
            }}>
              Monthly
            </h2>
            <div style={{
              fontSize: '3.5em',
              fontWeight: 'bold',
              color: '#667eea',
              marginBottom: '20px'
            }}>
              $99
              <span style={{ fontSize: '0.3em', color: '#999' }}>/month</span>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Daily updated leads</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Austin coverage (more cities coming)</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Unlimited downloads</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ CSV format</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Cancel anytime</li>
            </ul>
            <button
              onClick={handleSubscribe}
              style={{
                width: '100%',
                padding: '15px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Subscribe Now
            </button>
          </div>

          {/* Annual Plan */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            textAlign: 'center',
            border: '3px solid #667eea',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#667eea',
              color: 'white',
              padding: '5px 20px',
              borderRadius: '20px',
              fontSize: '0.9em',
              fontWeight: 'bold'
            }}>
              BEST VALUE
            </div>
            <h2 style={{
              color: '#333',
              fontSize: '2em',
              marginBottom: '10px'
            }}>
              Annual
            </h2>
            <div style={{
              fontSize: '3.5em',
              fontWeight: 'bold',
              color: '#667eea',
              marginBottom: '20px'
            }}>
              $999
              <span style={{ fontSize: '0.3em', color: '#999' }}>/year</span>
            </div>
            <p style={{
              color: '#28a745',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Save $189/year (16% off)
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Daily updated leads</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Austin coverage (more cities coming)</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Unlimited downloads</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ CSV format</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✓ Priority support</li>
            </ul>
            <button
              onClick={handleSubscribe}
              style={{
                width: '100%',
                padding: '15px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* What's Included Section */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginTop: '40px',
          maxWidth: '900px',
          margin: '40px auto 0'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '2em',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            What's Included
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📋 Permit Types</h3>
              <p style={{
                color: '#666',
                fontSize: '0.85em',
                fontStyle: 'italic',
                marginBottom: '10px'
              }}>
                *Note: Not all permit types are available in all cities
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Building Permits</li>
                <li>Electrical Permits</li>
                <li>Plumbing Permits</li>
                <li>Mechanical Permits</li>
                <li>Driveway / Sidewalks</li>
              </ul>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📊 Data Points</h3>
              <p style={{
                color: '#666',
                fontSize: '0.85em',
                fontStyle: 'italic',
                marginBottom: '10px'
              }}>
                *Note: Not all data points are available on all permits
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Date</li>
                <li>City</li>
                <li>Permit Type</li>
                <li>Permit Number</li>
                <li>Address</li>
                <li>Description</li>
              </ul>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>🔄 Updates</h3>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Daily refresh</li>
                <li>CSV format</li>
                <li>Instant download</li>
                <li>Historical data available</li>
                <li>Clean, organized data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
