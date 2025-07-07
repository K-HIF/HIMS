import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // close menu on click
    }
  };

  const triggerLoginModal = () => {
    const loginEvent = new CustomEvent('openLoginModal');
    window.dispatchEvent(loginEvent);
    setMenuOpen(false); // close menu on click
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-deepBlue shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <div className={`text-xl font-bold ${scrolled ? 'text-white' : 'text-primary'}`}>
          MedicApp
        </div>

        {/* Desktop Nav */}
        <ul className={`hidden md:flex gap-6 font-medium ${scrolled ? 'text-white' : 'text-gray-800'}`}>
          <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection('about')}>About</li>
          <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection('services')}>Services</li>
          <li className="cursor-pointer hover:text-primary" onClick={triggerLoginModal}>Login</li>
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`focus:outline-none ${scrolled ? 'text-white' : 'text-gray-800'}`}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute right-4 mt-2 bg-white/20 backdrop-blur-sm text-white rounded-lg py-4 px-6 space-y-4 z-40">
          <div className="cursor-pointer hover:text-primary" onClick={() => scrollToSection('about')}>About</div>
          <div className="cursor-pointer hover:text-primary" onClick={() => scrollToSection('services')}>Services</div>
          <div className="cursor-pointer hover:text-primary" onClick={triggerLoginModal}>Login</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
