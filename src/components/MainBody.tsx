import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import medicImage from '../assets/medic.jpeg';

const MainBody: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState('A17xx');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin1234');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>('admin');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const BASE_URL = 'https://healthmgmt-7ztg.onrender.com';

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Lab', value: 'lab' },
    { label: 'Reception', value: 'reception' },
    { label: 'Checkout', value: 'checkout' },
    { label: 'Pharmacy', value: 'pharmacy' },
  ];

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsRegistering(false);
    setUsername('A17xx');
    setPassword('admin1234');
    setEmail('');
    setConfirmPassword('');
    setRole('admin');
    setShowRoleDropdown(false);
  };

  useEffect(() => {
    const openModalListener = () => setShowModal(true);
    window.addEventListener('openLoginModal', openModalListener);
    return () => window.removeEventListener('openLoginModal', openModalListener);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setShowRoleDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isRegistering ? `${BASE_URL}/api/users/register/` : `${BASE_URL}/api/users/login/`;
      const payload = isRegistering
        ? { username, email, password, role }
        : { username, password, role };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Something went wrong');
      if (isRegistering) {
        setIsRegistering(false); // Switch to login form
      } else {
        // Login success
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('role', role); // Store role for routing
        closeModal();
        navigate(`/dashboard/${role}`); // Route to correct dashboard
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen relative pt-24 text-white home">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50 z-0 pointer-events-none"
        style={{ backgroundImage: `url(${medicImage})` }}
      />

      {!showModal && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">MedicApp</h1>
          <p className="text-lg text-white/80 max-w-xl">
            Empowering healthcare providers with intelligent, secure, and accessible tools to manage patient care.
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
          <div
            ref={modalRef}
            className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20 relative"
          >
            {/* Role dropdown trigger */}
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowRoleDropdown((prev) => !prev)}
                className="text-white text-2xl font-light hover:text-cyan-400 transition"
                aria-label="Select Role"
              >
                +
              </button>
              {showRoleDropdown && (
                <div className="absolute top-8 right-0 w-32 bg-white rounded shadow-lg z-50 border border-cyan-200" style={{ fontSize: '0.95rem' }}>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleRoleSelect(opt.value)}
                      className={`block w-full text-left px-3 py-1 text-gray-800 hover:bg-cyan-100 ${role === opt.value ? 'bg-cyan-200 font-bold' : ''}`}
                      style={{ fontSize: '0.95rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="/" className="inline-block mb-6">
              <img
                src="https://img.icons8.com/arcade/64/hospital.png"
                alt="MedicApp Logo"
                className="h-12 mx-auto"
              />
            </a>

            <h2 className="text-3xl font-bold text-white mb-2">
              {isRegistering ? 'Create an Account' : 'Welcome to MedicApp'}
            </h2>
            <p className="text-sm text-white/70 mb-6">
              {isRegistering
                ? 'Start managing your health the smart way.'
                : 'Sign in to manage your medical records.'}
            </p>

            <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {isRegistering && (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {isRegistering && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              )}
              {/* Show selected role */}
              <div className="w-full text-left text-white/80 text-sm mb-2">
                Role:{' '}
                <span className="font-bold text-cyan-300">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded"
              >
                {isLoading
                  ? isRegistering
                    ? 'Registering...'
                    : 'Signing in...'
                  : isRegistering
                  ? 'Register'
                  : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-white/30" />
              <span className="mx-2 text-white/60 text-sm">OR</span>
              <hr className="flex-grow border-white/30" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200 transition"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              {isRegistering ? 'Register with Google' : 'Sign in with Google'}
            </button>

            <p className="mt-6 text-sm text-white/70">
              {isRegistering ? 'Already have an account?' : 'New to MedicApp?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-cyan-300 hover:underline transition"
              >
                {isRegistering ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-44 z-20 overflow-hidden pointer-events-none">
        <div className="wave"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    </main>
  );
};

export default MainBody;
