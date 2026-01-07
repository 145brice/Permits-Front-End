'use client';

interface FilterBarProps {
  onFilter: (type: string) => void;
  onZipChange: (zip: string) => void;
}

export default function FilterBar({ onFilter, onZipChange }: FilterBarProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '10px',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <input
          type="text"
          placeholder="Zip code..."
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
          onChange={(e) => onZipChange(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            style={{
              fontSize: '13px',
              padding: '8px 14px',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onClick={() => onFilter('permit')}
            onMouseOver={(e) => e.currentTarget.style.background = '#ea580c'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f97316'}
          >
            🔨 Permits
          </button>
          <button
            style={{
              fontSize: '13px',
              padding: '8px 14px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onClick={() => onFilter('all')}
            onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
}
