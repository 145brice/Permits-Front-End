'use client';

import Nav from '../components/Nav';

export default function Purchase() {
  const cities = [
    {
      name: 'Austin',
      status: 'Active',
      price: '$99/month',
      stripeLink: 'https://buy.stripe.com/5kQ28t3vadGHfyyeTt63K0F',
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'Nashville',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'Houston',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'Charlotte',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'Phoenix',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'San Antonio',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    },
    {
      name: 'Chattanooga',
      status: 'Coming Soon',
      price: '$99/month',
      stripeLink: null,
      description: 'Daily updated construction permits and recent home sales'
    }
  ];

  const handlePurchase = (stripeLink: string | null) => {
    if (stripeLink) {
      window.location.href = stripeLink;
    }
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
        margin: '0 auto',
        paddingTop: '60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '3em',
            marginBottom: '10px'
          }}>
            Purchase Access by City
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2em'
          }}>
            Choose your city and get instant access to fresh construction leads
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {cities.map((city, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                textAlign: 'center',
                position: 'relative',
                opacity: city.status === 'Coming Soon' ? 0.7 : 1
              }}
            >
              {city.status === 'Active' && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: '#28a745',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.8em',
                  fontWeight: 'bold'
                }}>
                  ACTIVE
                </div>
              )}
              
              <h2 style={{
                color: '#333',
                fontSize: '2em',
                marginBottom: '10px'
              }}>
                {city.name}
              </h2>
              
              <div style={{
                fontSize: '2.5em',
                fontWeight: 'bold',
                color: '#667eea',
                marginBottom: '15px'
              }}>
                {city.price}
              </div>
              
              <p style={{
                color: '#666',
                fontSize: '0.95em',
                marginBottom: '25px',
                minHeight: '40px'
              }}>
                {city.description}
              </p>
              
              <button
                onClick={() => handlePurchase(city.stripeLink)}
                disabled={city.status === 'Coming Soon'}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: city.status === 'Active' ? '#667eea' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: city.status === 'Active' ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => {
                  if (city.status === 'Active') {
                    e.currentTarget.style.background = '#5568d3';
                  }
                }}
                onMouseOut={(e) => {
                  if (city.status === 'Active') {
                    e.currentTarget.style.background = '#667eea';
                  }
                }}
              >
                {city.status === 'Active' ? 'Purchase Now' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.8em',
            marginBottom: '15px'
          }}>
            What's Included
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>📅</div>
              <div style={{ fontWeight: 'bold' }}>Daily Updates</div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Fresh leads every day</div>
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>📊</div>
              <div style={{ fontWeight: 'bold' }}>Unlimited Downloads</div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>No restrictions</div>
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>📁</div>
              <div style={{ fontWeight: 'bold' }}>CSV Format</div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Easy to import</div>
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>🗺️</div>
              <div style={{ fontWeight: 'bold' }}>Interactive Map</div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Visual dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
