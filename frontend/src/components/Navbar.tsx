import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../styles/NavbarStyles';
import { logo } from '../assets/index';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isLogoLoaded, setIsLogoLoaded] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (sectionId: string) => {
    closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          {isLogoLoaded ? (
            <img 
              src={logo} 
              alt="Hair Analysis" 
              onError={() => setIsLogoLoaded(false)} 
              className="w-12 h-12 md:w-16 md:h-16" 
            />
          ) : (
            <span className="text-xl font-bold text-green-500">Hair Analysis</span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className={styles.toggleButton}>
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.openMenu : styles.closedMenu}`}>
          <li>
            <button onClick={() => scrollToSection('features')} className={styles.link}>
              Features
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('pricing')} className={styles.link}>
              Pricing
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('how-it-works')} className={styles.link}>
              How It Works
            </button>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.getStartedButton}
            onClick={() => isSignedIn ? navigate('/dashboard/analysis') : navigate('/signup')}
          >
            Get Started
          </button>
          <button
            className={styles.loginButton}
            onClick={() => isSignedIn ? navigate('/dashboard/analysis') : navigate('/login')}
          >
            {isSignedIn ? 'Dashboard' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
