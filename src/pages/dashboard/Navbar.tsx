import React, { useState, useRef, useEffect } from 'react';
import { Star, ThumbsDown, ThumbsUp, Menu, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';

const repositoryUrl = 'https://github.com/K-HIF/HIMS';
//const BASE_URL = 'https://healthmgmt-7ztg.onrender.com';
const BASE_URL = import.meta.env.VITE_API_BASE_URL||'http://127.0.0.1:8000';

type NavbarProps = {
  selectedPage: string;
  searchTerm: string;
  onSearch: (term: string) => void;
  onToggleSidebar: () => void;
  role?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  selectedPage,
  searchTerm,
  onSearch,
  onToggleSidebar,
  role = 'admin',
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(false);
  const [loadingUpvote, setLoadingUpvote] = useState<boolean>(false);
  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [loadingDownvote, setLoadingDownvote] = useState<boolean>(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Dismiss search input on outside click
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

  // Fetch stars + downvotes on load
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/stars/`);
        const data = await response.json();
        setStarCount(data?.stars ?? 0);
      } catch (error) {
        console.error('Failed to fetch star count:', error);
        setStarCount(0);
      }
    };

    const fetchDownvotes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/downvotes/`);
        const data = await response.json();
        setDownvoteCount(data?.count ?? 0);
      } catch (error) {
        console.error('Failed to fetch downvote count:', error);
        setDownvoteCount(0);
      }
    };
    const fetchUpvotes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/upvotes/`);
        const data = await response.json();
        setUpvoteCount(data?.count ?? 0);
      } catch (error) {
        console.error('Failed to fetch upvote count:', error);
        setUpvoteCount(0);
      }
    };

    setHasUpvoted(sessionStorage.getItem('upvoted') === 'true');
    setHasDownvoted(sessionStorage.getItem('downvoted') === 'true');

    fetchStars();
    fetchDownvotes();
    fetchUpvotes();
  }, []);

  // Downvote handler
  const handleDownvote = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('Please log in to downvote.');
      return;
    }

    if (hasDownvoted) {
      toast.info('You have already downvoted in this session.');
      return;
    }

    try {
      setLoadingDownvote(true);
      const res = await fetch(`${BASE_URL}/api/users/downvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || 'Failed to downvote.');
      }

      sessionStorage.setItem('downvoted', 'true');
      setHasDownvoted(true);
      setDownvoteCount(data.count ?? downvoteCount + 1); // use server count if available
      toast.success('Thanks for your feedback.');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoadingDownvote(false);
    }
  };
  //upvote handler

  const handleUpvote = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('Please log in to upvote.');
      return;
    }

    if (hasUpvoted) {
      toast.info('You have already upvoted in this session.');
      return;
    }

    try {
      setLoadingUpvote(true);
      const res = await fetch(`${BASE_URL}/api/users/upvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || 'Failed to upvote.');
      }

      sessionStorage.setItem('upvoted', 'true');
      setHasUpvoted(true);
      setUpvoteCount(data.count ?? upvoteCount + 1); // use server count if available
      toast.success('Thanks for your feedback.');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoadingUpvote(false);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-transparent relative">
      {/* Left section */}
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden mr-3 text-gray-700">
          <Menu size={20} />
        </button>
        <span className="text-sm text-gray-500 font-medium hidden md:inline">
          hospital / {role} / {selectedPage}
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
          
        </a>
        <span className="text-gray-700 text-sm">
          {starCount !== null ? starCount : '...'}
        </span>

        <button
          onClick={handleUpvote}
          disabled={hasUpvoted || loadingUpvote}
          className={`flex items-center gap-1 text-sm px-3 py-1 border rounded ${hasUpvoted
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          <ThumbsUp size={16} />
          {loadingUpvote ? 'Voting...' : hasUpvoted ? '' : 'Upvote'}
        </button>

        <span className="text-gray-700 text-sm">{upvoteCount}</span>

        <button
          onClick={handleDownvote}
          disabled={hasDownvoted || loadingDownvote}
          className={`flex items-center gap-1 text-sm px-3 py-1 border rounded ${hasDownvoted
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          <ThumbsDown size={16} />
          {loadingDownvote ? 'Voting...' : hasDownvoted ? 'Downvoted' : ''}
        </button>
        <span className="text-gray-700 text-sm">{downvoteCount}</span>
      </div>
    </nav>
  );
};

export default Navbar;
