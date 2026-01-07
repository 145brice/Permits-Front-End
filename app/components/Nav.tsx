export default function Nav() {
  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px 40px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      flexWrap: 'wrap',
      gap: '15px'
    }}>
      <a
        href="/"
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.3em',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        Construction Leads
      </a>
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <a
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95em',
            fontWeight: 'bold',
            padding: '8px 15px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          Home
        </a>
        <a
          href="/dashboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95em',
            fontWeight: 'bold',
            padding: '8px 15px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          Map 🗺️
        </a>
        <a
          href="/counties"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95em',
            fontWeight: 'bold',
            padding: '8px 15px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          Coverage
        </a>
        <a
          href="/pricing"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95em',
            fontWeight: 'bold',
            padding: '8px 15px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '5px',
            transition: 'background 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          Pricing
        </a>
      </div>
    </nav>
  );
}
