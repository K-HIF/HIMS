import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any auth-related data (adjust depending on your auth system)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Optionally show a message or delay
    setTimeout(() => {
      navigate('/'); // Redirect to login or home
    }, 1000);
  }, [navigate]);

  return (
    <div className="text-center text-lg font-semibold text-gray-700">
      Logging out...
    </div>
  );
};

export default Logout;
