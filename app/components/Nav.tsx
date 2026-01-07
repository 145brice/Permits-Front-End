'use client';

import { useState } from 'react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <a
        href="/"
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: 'clamp(1em, 4vw, 1.2em)',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        Construction Leads
      </a>

      {/* Hamburger Menu Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5em',
          cursor: 'pointer',
          padding: '5px'
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Desktop Menu */}
      <div 
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
        className="desktop-menu"
      >
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
          Dashboard
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
          className="mobile-menu"
        >
          <a
            href="/"
            onClick={() => setIsOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            Home
          </a>
          <a
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            Dashboard
          </a>
          <a
            href="/counties"
            onClick={() => setIsOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            Coverage
          </a>
          <a
            href="/pricing"
            onClick={() => setIsOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            Pricing
          </a>
          <a
            href="/purchase"
            onClick={() => setIsOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            Purchase
          </a>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
