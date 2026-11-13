export default function Logo({ size = 'medium', className = '' }) {
  // Size configurations
  const sizeConfig = {
    small: {
      mainFontSize: '20px',
      subtitleFontSize: '7px',
      letterSpacing: '3px',
      // Mobile override
      mobileFontSize: '14px',
      mobileSubtitle: '5px',
      mobileLetterSpacing: '2px'
    },
    medium: {
      mainFontSize: '28px',
      subtitleFontSize: '9px',
      letterSpacing: '5px',
      mobileFontSize: '18px',
      mobileSubtitle: '6px',
      mobileLetterSpacing: '3px'
    },
    large: {
      mainFontSize: '36px',
      subtitleFontSize: '11px',
      letterSpacing: '6px',
      mobileFontSize: '24px',
      mobileSubtitle: '8px',
      mobileLetterSpacing: '4px'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <>
      <style jsx>{`
        .logo-main-text {
          font-size: ${config.mainFontSize};
          letter-spacing: ${config.letterSpacing};
        }
        
        .logo-subtitle-text {
          font-size: ${config.subtitleFontSize};
          letter-spacing: ${config.letterSpacing};
        }
        
        @media (max-width: 480px) {
          .logo-main-text {
            font-size: ${config.mobileFontSize};
            letter-spacing: ${config.mobileLetterSpacing};
          }
          
          .logo-subtitle-text {
            font-size: ${config.mobileSubtitle};
            letter-spacing: ${config.mobileLetterSpacing};
          }
        }
      `}</style>
      
      <div className={`logo-container ${className}`} style={{ textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '5px 0'
        }}>
          {/* MENSURFACE Text - MEN bold, SURFACE light */}
          <div className="logo-main-text" style={{
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
            color: '#000',
            marginBottom: '3px',
            lineHeight: '1'
          }}>
            <span style={{ fontWeight: '900' }}>MEN</span>
            <span style={{ fontWeight: '300' }}>SURFACE</span>
          </div>
          
          {/* Subtitle */}
          <div className="logo-subtitle-text" style={{
            fontWeight: '300',
            fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
            color: '#000',
            textAlign: 'center',
            lineHeight: '1'
          }}>
            - BARBER AND SHOP -
          </div>
        </div>
      </div>
    </>
  );
}
