export default function Nav() {
  return (
    <nav style={{
      position: 'fixed',
      top: '120px',
      left: 0,
      right: 0,
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <a
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Home
        </a>
        <a
          href="/dashboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Map 🗺️
        </a>
        <a
          href="/counties"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Coverage
        </a>
        <a
          href="/pricing"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Pricing
        </a>
        <a
          href="/purchase"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Purchase
        </a>
      </div>
    </nav>
  );
}
