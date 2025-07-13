import React, { useState, useRef, useEffect } from 'react';
import { Star, ThumbsDown, Menu, Search, X } from 'lucide-react';

type NavbarProps = {
  selectedPage: string;
  searchTerm: string;
  onSearch: (term: string) => void;
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  selectedPage,
  searchTerm,
  onSearch,
  onToggleSidebar,
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Handle click outside mobile search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMobileSearch &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSearch]);

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-transparent relative">
      {/* Left section */}
      <div className="flex items-center">
        {/* Hamburger on small screens */}
        <button onClick={onToggleSidebar} className="md:hidden mr-3 text-gray-700">
          <Menu size={20} />
        </button>

        <span className="text-sm text-gray-500 font-medium hidden md:inline">
          hospital / {selectedPage}
        </span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        {/* Desktop search */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="hidden md:block border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full max-w-md"
        />

        {/* Mobile search icon and dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="text-gray-700"
          >
            <Search size={20} />
          </button>

          {showMobileSearch && (
            <div
              ref={mobileSearchRef}
              className="absolute left-0 top-8 w-[80vw] bg-white border border-gray-300 shadow-md rounded px-3 py-2 z-50"
            >
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="flex-1 text-sm border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="ml-2 text-gray-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-black text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
          <Star size={16} />
          Star
        </button>
        <span className="text-gray-700 text-sm">1.2k</span>

        <button className="flex items-center gap-1 text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
          <ThumbsDown size={16} />
          Downvote
        </button>
        <span className="text-gray-700 text-sm">78</span>
      </div>
    </nav>
  );
};

export default Navbar;
