import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    // Clear stored data
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    // Redirect using full window.location for clean HashRouter behavior
    window.location.href = '/HIMS/#/';
  }, []);

  return (
    <div className="text-center text-lg font-semibold text-gray-700">
      Logging out...
    </div>
  );
};

export default Logout;
