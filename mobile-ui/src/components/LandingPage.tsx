// LandingPage.tsx
// Renders a splash/landing screen with a background SVG and a slide-up animation before redirecting to login.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/LandingPage.css';
import landingBgSvg from '../assets/landing-page/Landing Page.svg';

/**
 * LandingPage component
 * Shows a landing splash with animation, then navigates to the login page after a short delay.
 */
const LandingPage: React.FC = () => {
  // Navigation hook
  const navigate = useNavigate();
  // State for triggering slide-up animation
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    // Start animation before navigating
    const animateTimeout = setTimeout(() => {
      setSlideUp(true);
    }, 1800); // Begin slide 0.2s before navigation

    // Navigate to login after 2 seconds
    const navTimeout = setTimeout(() => {
      navigate('/login');
    }, 2000);

    // Cleanup timeouts on unmount
    return () => {
      clearTimeout(navTimeout);
      clearTimeout(animateTimeout);
    };
  }, [navigate]);

  return (
    <div className={`landing-bg-container${slideUp ? ' slide-up' : ''}`}>
      {/* SVG as background */}
      <img 
        src={landingBgSvg} 
        alt="Landing page background" 
        className="landing-svg-bg"
      />
    </div>
  );
};

// Export LandingPage as default
export default LandingPage;