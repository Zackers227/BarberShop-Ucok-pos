import Image from 'next/image';

export default function Logo({ size = 'medium', className = '' }) {
  const sizes = {
    small: { container: 120, text: 'text-sm' },
    medium: { container: 180, text: 'text-base' },
    large: { container: 240, text: 'text-lg' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className={`logo-container ${className}`} style={{ textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-block',
        padding: '10px 0'
      }}>
        {/* M Logo Icon */}
        <div style={{
          fontSize: size === 'large' ? '60px' : size === 'small' ? '36px' : '48px',
          fontWeight: '900',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          marginBottom: '5px',
          letterSpacing: '-2px'
        }}>
          <svg width={size === 'large' ? '80' : size === 'small' ? '48' : '64'} height={size === 'large' ? '60' : size === 'small' ? '36' : '48'} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5 L25 35 L40 5 L55 35 L70 5 L80 5 L80 55 L70 55 L70 20 L55 50 L40 20 L25 50 L10 20 L10 55 L0 55 L0 5 Z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* MENSURFACE Text */}
        <div style={{
          fontSize: size === 'large' ? '32px' : size === 'small' ? '18px' : '24px',
          fontWeight: '900',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          letterSpacing: '-1px',
          marginBottom: '2px'
        }}>
          MENSURFACE
        </div>
        
        {/* Subtitle */}
        <div style={{
          fontSize: size === 'large' ? '12px' : size === 'small' ? '8px' : '10px',
          fontWeight: '400',
          fontFamily: 'Arial, sans-serif',
          color: '#666',
          letterSpacing: '3px'
        }}>
          - BARBER AND SHOP -
        </div>
      </div>
    </div>
  );
}
