export default function Logo({ size = 'medium', className = '' }) {
  return (
    <div className={`logo-container ${className}`} style={{ textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-block',
        padding: '5px 0'
      }}>
        {/* MENSURFACE Text */}
        <div style={{
          fontSize: size === 'large' ? '36px' : size === 'small' ? '20px' : '28px',
          fontWeight: '900',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          letterSpacing: '0.05em',
          marginBottom: '3px'
        }}>
          MENSURFACE
        </div>
        
        {/* Subtitle */}
        <div style={{
          fontSize: size === 'large' ? '11px' : size === 'small' ? '7px' : '9px',
          fontWeight: '400',
          fontFamily: 'Arial, sans-serif',
          color: '#666',
          letterSpacing: '0.3em',
          textAlign: 'center'
        }}>
          - BARBER AND SHOP -
        </div>
      </div>
    </div>
  );
}
