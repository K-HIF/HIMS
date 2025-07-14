import React, { useState, useRef, useEffect } from 'react';
import { Star, ThumbsDown, Menu, Search, X } from 'lucide-react';

const repositoryUrl = 'https://github.com/K-HIF/HIMS'; 

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
  const [starCount, setStarCount] = useState<number | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close mobile search on click outside
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

  // Fetch stars
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://healthmgmt-7ztg.onrender.com/api/users/stars/');
        const data = await response.json();
        setStarCount(data?.stars ?? 0);
      } catch (error) {
        console.error('Failed to fetch star count:', error);
        setStarCount(0);
      }
    };

    fetchStars();
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-transparent relative">
      {/* Left section */}
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden mr-3 text-gray-700">
          <Menu size={20} />
        </button>
        <span className="text-sm text-gray-500 font-medium hidden md:inline">
          hospital / {selectedPage}
        </span>
      </div>

      {/* Center search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="hidden md:block border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full max-w-md"
        />

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
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-black text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          <Star size={16} />
          Star
        </a>
        <span className="text-gray-700 text-sm">
          {starCount !== null ? starCount : '...'}
        </span>

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
