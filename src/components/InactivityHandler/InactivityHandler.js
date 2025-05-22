import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Modal from '../Modal/Modal';
import { useAuth } from '../../context/AuthContext';

const WARNING_TIME_MS = 5 * 60 * 1000; // 5 minutes

const InactivityHandler = ({ children }) => {
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const warningTimeout = useRef();
  const logoutTimeout = useRef();

  // Helper to get JWT expiration (in ms since epoch)
  const getTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        return decoded.exp * 1000; // exp is in seconds
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Set up timers based on JWT expiration
  const setupTimers = () => {
    clearTimers();
    const exp = getTokenExpiration();
    if (!exp) return;

    const now = Date.now();
    const msUntilLogout = exp - now;
    const msUntilWarning = msUntilLogout - WARNING_TIME_MS;

    if (msUntilWarning > 0) {
      warningTimeout.current = setTimeout(() => setShowWarning(true), msUntilWarning);
    } else if (msUntilLogout > 0) {
      // If less than 5 minutes left, show warning immediately
      setShowWarning(true);
    }

    if (msUntilLogout > 0) {
      logoutTimeout.current = setTimeout(() => {
        setShowWarning(false);
        logout();
        localStorage.removeItem('token');
      }, msUntilLogout);
    } else {
      // Token already expired
      logout();
      localStorage.removeItem('token');
    }
  };

  // Clear all timers
  const clearTimers = () => {
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
  };

  // Reset timers on user activity
  useEffect(() => {
    const activityHandler = () => {
      setShowWarning(false);
      setupTimers();
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, activityHandler));
    setupTimers();

    return () => {
      clearTimers();
      events.forEach(event => window.removeEventListener(event, activityHandler));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Modal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Inactivity Warning"
        message="Your session will soon expire and you will be logged out."
        buttonText="OK"
      />
      {children}
    </>
  );
};

export default InactivityHandler; 