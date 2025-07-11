import React from 'react';
import { Star, ThumbsDown } from 'lucide-react';

type NavbarProps = {
  selectedPage: string;
  searchTerm: string;
  onSearch: (term: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ selectedPage, searchTerm, onSearch }) => {
  return (
    <nav className="flex items-center justify-between px-4 py-3 rounded-xl bg-transparent">
      <div className="text-sm text-gray-500 font-medium">
        hospital / {selectedPage}
      </div>

      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full max-w-md"
        />
      </div>

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
