export default function Logo({ size = 'medium', className = '' }) {
  // Size configurations
  const sizeConfig = {
    small: {
      mainFontSize: '20px',
      subtitleFontSize: '7px',
      letterSpacing: '3px'
    },
    medium: {
      mainFontSize: '28px',
      subtitleFontSize: '9px',
      letterSpacing: '5px'
    },
    large: {
      mainFontSize: '36px',
      subtitleFontSize: '11px',
      letterSpacing: '6px'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div className={`logo-container ${className}`} style={{ textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-block',
        padding: '5px 0'
      }}>
        {/* MENSURFACE Text - MEN bold, SURFACE light */}
        <div style={{
          fontSize: config.mainFontSize,
          fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          color: '#000',
          letterSpacing: config.letterSpacing,
          marginBottom: '3px',
          lineHeight: '1'
        }}>
          <span style={{ fontWeight: '900' }}>MEN</span>
          <span style={{ fontWeight: '300' }}>SURFACE</span>
        </div>
        
        {/* Subtitle */}
        <div style={{
          fontSize: config.subtitleFontSize,
          fontWeight: '300',
          fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
          color: '#000',
          letterSpacing: config.letterSpacing,
          textAlign: 'center',
          lineHeight: '1'
        }}>
          - BARBER AND SHOP -
        </div>
      </div>
    </div>
  );
}
