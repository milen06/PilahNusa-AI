import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/**
 * Root layout wrapper — sidebar on desktop, bottom nav on mobile
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* Mobile Floating Team Button */}
      {isHomePage && (
        <Link
          to="/team"
          className="mobile-team-btn animate-fade-in"
          aria-label="Tim Pengembang"
          id="btn-mobile-team"
        >
          <Users size={26} color="var(--color-primary)" />
        </Link>
      )}

      {/* Mobile Bottom Nav */}
      <BottomNav />

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
          position: relative;
        }

        .layout__main {
          flex: 1;
          min-width: 0;
          overflow-x: hidden;
        }

        /* Mobile Team Button Style */
        .mobile-team-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 52px;
          height: 52px;
          background: var(--color-primary-bg);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.08);
          color: var(--color-primary);
          z-index: 99;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
        }

        .mobile-team-btn:active {
          transform: scale(0.92);
          background: var(--color-primary-bg-md);
        }

        /* Mobile & Tablet: sidebar hidden, bottom nav shown, add bottom padding */
        @media (max-width: 1023px) {
          .layout {
            flex-direction: column;
          }

          .layout__main {
            padding-bottom: 90px;
          }
        }

        /* Hide mobile team button on desktop screen sizes */
        @media (min-width: 1024px) {
          .mobile-team-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
