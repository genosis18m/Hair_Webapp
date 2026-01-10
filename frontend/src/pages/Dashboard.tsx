import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { FaHome, FaCamera, FaChartLine, FaHistory, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react'; 
import { logo, hair } from '../assets/index';
import styles from '../styles/DashboardStyles'; 

const Dashboard: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleCard = () => setShowCard((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 3 ? `${username.slice(0, 3)}**` : username;
    const maskedDomain = domain.split('.').map((part, index) => (index === 0 ? `${part[0]}**` : part)).join('.');
    return `${maskedUsername}@${maskedDomain}`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.container}>
      {/* Mobile Toggle Button */}
      {!isHomePage && (
        <div className={styles.mobileToggle}>
          <span className={styles.mobileTitle}>Hair Analysis</span>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            <FaBars className={styles.toggleIcon} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      {!isHomePage && (
        <aside className={`${styles.sidebar} ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>Hair Analysis</span>
          </div>

          {/* Navigation Links */}
          <nav className={styles.nav}>
            <Link
              to="/dashboard/analysis"
              className={`${styles.navLink} ${location.pathname === '/dashboard/analysis' ? styles.activeLink : ''}`}
            >
              <FaChartLine className={styles.navIcon} />
              <span className={styles.navText}>Beauty</span>
            </Link>
            <Link
              to="/dashboard/photo"
              className={`${styles.navLink} ${location.pathname === '/dashboard/photo' ? styles.activeLink : ''}`}
            >
              <FaCamera className={styles.navIcon} />
              <span className={styles.navText}>Take Photo</span>
            </Link>
          </nav>

          {/* Sidebar Footer with User Information */}
          <div className={styles.sidebarFooter}>
            <p className={styles.credits}>(Credits: 50)</p>
            <div onClick={toggleCard} className={styles.avatarContainer}>
              <img
                src={user?.imageUrl || hair}
                alt="User Avatar"
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.fullName || user?.firstName || "User"}</p>
              <p className={styles.userEmail}>{maskEmail(user?.primaryEmailAddress?.emailAddress || "user@example.com")}</p>
            </div>
          </div>

          {/* User Info Card */}
          {showCard && user && (
            <div
              ref={cardRef}
              className={styles.userCard}
            >
              <div className={styles.cardHeader}>
                <img
                  src={user?.imageUrl || hair}
                  alt="User Avatar"
                  className={styles.cardAvatar}
                />
                <div>
                  <p className={styles.cardUserName}>{user?.fullName || user?.firstName || "User"}</p>
                  <p className={styles.cardUserEmail}>{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</p>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        <Outlet /> {/* This is where different pages will be rendered */}
      </div>
    </div>
  );
};

export default Dashboard;
