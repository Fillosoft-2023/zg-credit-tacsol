import React, { useEffect } from 'react';

const LogoutInactive = ({ logout }) => {
  let logoutTimeout;

  const startLogoutTimer = () => {
    logoutTimeout = setTimeout(logout, 30 * 60 * 1000); // 5 minutes (in milliseconds)
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimeout);
    startLogoutTimer();
  };

  const handleUserActivity = () => {
    resetLogoutTimer();
  };

  useEffect(() => {
    startLogoutTimer();

    const handleBeforeUnload = (event) => {
      // Cancel the default behavior to show a confirmation dialog
     // event.preventDefault();
      // Run the logout function only if it's not a reload/refresh
      if (performance.navigation.type !== 1) {
        logout();
      }
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // Or you can return any component or JSX if needed
};

export default LogoutInactive;
