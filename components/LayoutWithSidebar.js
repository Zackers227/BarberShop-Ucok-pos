import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function LayoutWithSidebar({ 
  children, 
  title = 'Barbershop Ucok POS',
  currentPage = '',
  user = null,
  pendingCount = 0
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    // Listen for closeSidebar event from Sidebar component
    const handleCloseSidebar = () => setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      window.addEventListener('closeSidebar', handleCloseSidebar);
      return () => window.removeEventListener('closeSidebar', handleCloseSidebar);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/styles.css" />
        <style>{`
          /* Base responsive adjustments */
          * {
            box-sizing: border-box;
          }

          /* Sidebar default styles - Desktop */
          aside {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
          }

          /* Hamburger Menu Button */
          .hamburger-btn {
            display: none;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1001;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 20px;
            transition: all 0.3s ease;
          }

          .hamburger-btn.hidden {
            opacity: 0;
            pointer-events: none;
          }

          /* Toggle Menu Visibility Button */
          .toggle-menu-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1002;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            font-size: 24px;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .toggle-menu-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.6);
          }

          .toggle-menu-btn:active {
            transform: scale(0.95);
          }

          /* Show hamburger on mobile and tablet */
          @media (max-width: 1024px) {
            .hamburger-btn {
              display: block;
            }

            .toggle-menu-btn {
              display: flex;
            }

            /* Hamburger hidden state on mobile */
            .hamburger-btn.hidden {
              display: none;
            }

            /* Show close button in sidebar on mobile */
            .sidebar-close-btn {
              display: block !important;
            }

            /* Sidebar mobile styles */
            aside {
              position: fixed !important;
              left: -280px !important;
              transition: left 0.3s ease !important;
              z-index: 1001 !important;
            }

            aside.sidebar-open {
              left: 0 !important;
            }

            /* Overlay when sidebar open */
            .sidebar-overlay {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 1000;
            }

            .sidebar-overlay.active {
              display: block;
            }

            .main-wrapper {
              margin-left: 0 !important;
              width: 100% !important;
            }
          }

          /* Desktop */
          @media (min-width: 1025px) {
            .hamburger-btn {
              display: none !important;
            }

            .toggle-menu-btn {
              display: none !important;
            }
          }
        `}</style>
      </Head>

      <div className="page-container">
        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-btn ${!menuVisible ? 'hidden' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Toggle Menu Visibility Button */}
        <button
          className="toggle-menu-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !menuVisible;
            setMenuVisible(newState);
            // Close sidebar when hiding hamburger button
            if (!newState) {
              setSidebarOpen(false);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={menuVisible ? 'Hide menu button' : 'Show menu button'}
          title={menuVisible ? 'Sembunyikan Tombol Menu' : 'Tampilkan Tombol Menu'}
          style={{
            display: 'flex',
            touchAction: 'manipulation'
          }}
        >
          {menuVisible ? '👁️' : '🔘'}
        </button>

        {/* Sidebar Overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Menu */}
        <div className={sidebarOpen ? 'sidebar-open' : ''}>
          <Sidebar 
            user={user} 
            pendingCount={pendingCount} 
            currentPage={currentPage}
          />
        </div>

        {/* Main Content Wrapper */}
        <div className="main-wrapper" style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
          <Navbar currentPage={currentPage} />
          {children}
        </div>
      </div>
    </>
  );
}
