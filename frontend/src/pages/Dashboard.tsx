import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { FaCamera, FaChartLine, FaBars, FaSignOutAlt, FaCoins, FaHistory, FaTimes } from 'react-icons/fa';
import { useUser, useClerk } from '@clerk/clerk-react'; 
import { logo, hair } from '../assets/index';
import styles from '../styles/DashboardStyles';
import { useUserData } from '../hooks/useUserData';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { credits, loading: userDataLoading } = useUserData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const toggleCard = () => setShowCard((prev) => !prev);

  // Close sidebar when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

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
      {/* Mobile Toggle Button - Fixed Header */}
      {!isHomePage && (
        <div className={styles.mobileToggle}>
          <span className={styles.mobileTitle}>Hair Analysis</span>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            {showSidebar ? <FaTimes className={styles.toggleIcon} /> : <FaBars className={styles.toggleIcon} />}
          </button>
        </div>
      )}

      {/* Mobile Backdrop */}
      {!isHomePage && showSidebar && (
        <div 
          className={styles.sidebarBackdrop}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      {!isHomePage && (
        <aside className={`${styles.sidebar} ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <Link to="/" className={`${styles.logoContainer} cursor-pointer hover:opacity-80 transition-opacity`}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>Hair Analysis</span>
          </Link>

          {/* Navigation Links */}
          <nav className={styles.nav}>
            <Link
              to="/dashboard/analysis"
              className={`${styles.navLink} ${location.pathname === '/dashboard/analysis' ? styles.activeLink : ''}`}
              onClick={closeSidebar}
            >
              <FaChartLine className={styles.navIcon} />
              <span className={styles.navText}>Beauty</span>
            </Link>
            <Link
              to="/dashboard/photo"
              className={`${styles.navLink} ${location.pathname === '/dashboard/photo' ? styles.activeLink : ''}`}
              onClick={closeSidebar}
            >
              <FaCamera className={styles.navIcon} />
              <span className={styles.navText}>Take Photo</span>
            </Link>
            <Link
              to="/dashboard/history"
              className={`${styles.navLink} ${location.pathname === '/dashboard/history' ? styles.activeLink : ''}`}
              onClick={closeSidebar}
            >
              <FaHistory className={styles.navIcon} />
              <span className={styles.navText}>History</span>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className={`${styles.navLink} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 mt-auto`}
            >
              <FaSignOutAlt className={styles.navIcon} />
              <span className={styles.navText}>Logout</span>
            </button>
          </nav>

          {/* Sidebar Footer with User Information */}
          <div className={styles.sidebarFooter}>
            <div className="flex items-center gap-2 mb-3">
              <FaCoins className="text-yellow-500" />
              <span className={styles.credits}>
                {userDataLoading ? '...' : credits} Credits
              </span>
            </div>
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
              <div className="border-t border-gray-100 pt-3 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">Credits</span>
                  <span className="font-bold text-green-600">{credits}</span>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
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
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
