import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerLoginModal = () => {
    const loginEvent = new CustomEvent('openLoginModal');
    window.dispatchEvent(loginEvent);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-deepBlue shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <div className={`text-xl font-bold ${scrolled ? 'text-white' : 'text-primary'}`}>
          MedicApp
        </div>
        <ul className={`flex gap-6 font-medium ${scrolled ? 'text-white' : 'text-gray-800'}`}>
          <li
            className="cursor-pointer hover:text-primary"
            onClick={() => scrollToSection('about')}
          >
            About
          </li>
          <li
            className="cursor-pointer hover:text-primary"
            onClick={() => scrollToSection('services')}
          >
            Services
          </li>
          <li
            className="cursor-pointer hover:text-primary"
            onClick={triggerLoginModal}
          >
            Login
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
