export default function Nav() {
  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <a
        href="/"
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5em',
          fontWeight: 'bold'
        }}
      >
        Construction Leads
      </a>
      <div style={{
        display: 'flex',
        gap: '20px'
      }}>
        <a
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s'
          }}
        >
          Home
        </a>
        <a
          href="/dashboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s'
          }}
        >
          Map 🗺️
        </a>
        <a
          href="/counties"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s'
          }}
        >
          Coverage
        </a>
        <a
          href="/pricing"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s'
          }}
        >
          Pricing
        </a>
      </div>
    </nav>
  );
}
