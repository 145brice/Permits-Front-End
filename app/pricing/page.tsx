'use client';

import Nav from '../components/Nav';

export default function Pricing() {
  const handleSubscribe = () => {
    window.location.href = 'https://buy.stripe.com/5kQ28t3vadGHfyyeTt63K0F';
  };

  const benefits = [
    '300-700 fresh leads daily',
    'All 7 major cities included',
    'Unlimited CSV downloads',
    'Interactive map view',
    'Daily automatic updates',
    'Complete contact details',
    'Filter by permit type',
    'Historical data access',
    'Cancel anytime'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />
      
      {/* Hero */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '220px 40px 60px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(2.5em, 5vw, 3.5em)',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Simple Pricing. Maximum Results.
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '1.3em',
          marginBottom: '50px'
        }}>
          One plan. All features. No hidden fees.
        </p>
      </div>

      {/* Pricing Card */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto 60px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px 40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          border: '3px solid rgba(255,255,255,0.5)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#28a745',
            color: 'white',
            padding: '8px 25px',
            borderRadius: '25px',
            fontSize: '0.9em',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
          }}>
            MOST POPULAR
          </div>
          
          <h2 style={{
            color: '#333',
            fontSize: '2em',
            marginBottom: '15px',
            marginTop: '10px'
          }}>
            All Access
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <span style={{
              fontSize: '4em',
              fontWeight: 'bold',
              color: '#667eea'
            }}>
              $99
            </span>
            <span style={{
              fontSize: '1.2em',
              color: '#999',
              marginLeft: '10px'
            }}>
              /month
            </span>
          </div>
          
          <p style={{
            color: '#28a745',
            fontWeight: 'bold',
            marginBottom: '30px',
            fontSize: '1.1em'
          }}>
            Save $189/year with annual plan
          </p>

          <button
            onClick={handleSubscribe}
            style={{
              width: '100%',
              padding: '18px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.3em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s',
              marginBottom: '30px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
              e.currentTarget.style.background = '#5568d3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              e.currentTarget.style.background = '#667eea';
            }}
          >
            Start Now →
          </button>

          <div style={{
            textAlign: 'left',
            borderTop: '2px solid #f0f0f0',
            paddingTop: '30px'
          }}>
            <h3 style={{
              color: '#333',
              fontSize: '1.2em',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              Everything included:
            </h3>
            {benefits.map((benefit, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                color: '#666',
                fontSize: '1.05em'
              }}>
                <span style={{
                  color: '#28a745',
                  fontSize: '1.3em',
                  marginRight: '12px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </span>
                {benefit}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#666',
              fontSize: '0.95em',
              marginBottom: '10px'
            }}>
              <strong>No contracts.</strong> Cancel anytime.
            </p>
            <p style={{
              color: '#999',
              fontSize: '0.85em'
            }}>
              🔒 Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial/Social Proof */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto 60px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '15px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'white',
            fontSize: '1.3em',
            fontStyle: 'italic',
            marginBottom: '20px',
            lineHeight: '1.6'
          }}>
            "We closed 3 kitchen remodels in the first week using these leads. Already paid for itself 10x over."
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.1em'
          }}>
            — Mike T., Electrical Contractor
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{
        background: 'white',
        padding: '80px 40px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5em',
            color: '#333',
            marginBottom: '50px'
          }}>
            Frequently Asked Questions
          </h2>
          {[
            {
              q: 'How current is the data?',
              a: 'Leads are updated every 24 hours. You get fresh permits filed the previous day.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. No contracts, no commitments. Cancel with one click from your account.'
            },
            {
              q: 'What cities are included?',
              a: 'Austin is live now. Nashville, Houston, Phoenix, San Antonio, Charlotte, and Chattanooga launching soon.'
            },
            {
              q: 'How do I get the leads?',
              a: 'Click any city in the header, enter your email, and download instantly as CSV. Import into any CRM.'
            }
          ].map((faq, idx) => (
            <div key={idx} style={{
              marginBottom: '30px',
              padding: '25px',
              background: '#f9f9f9',
              borderRadius: '10px',
              borderLeft: '4px solid #667eea'
            }}>
              <h3 style={{
                color: '#333',
                fontSize: '1.3em',
                marginBottom: '10px'
              }}>
                {faq.q}
              </h3>
              <p style={{
                color: '#666',
                fontSize: '1.05em',
                lineHeight: '1.6'
              }}>
                {faq.a}
              </p>
            </div>
          ))}
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
          Start Getting Leads Today
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '1.2em',
          marginBottom: '30px'
        }}>
          Join contractors already closing more deals
        </p>
        <button
          onClick={handleSubscribe}
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
          Get Started - $99/Month
        </button>
      </div>
    </div>
  );
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      paddingTop: '220px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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
