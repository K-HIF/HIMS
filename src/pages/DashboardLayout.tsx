import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../pages/dashboard/Sidebar';
import Navbar from '../pages/dashboard/Navbar';
import { Outlet, useParams } from 'react-router-dom';

const DashboardLayout: React.FC<{ role?: string }> = ({ role }) => {
  const params = useParams();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentRole = storedUser?.department?.toLowerCase() || role || params.role || 'admin';
  
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`z-40 fixed md:static top-0 left-0 h-full transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <Sidebar
          selectedPage={selectedPage}
          onSelect={setSelectedPage}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          role={currentRole}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <Navbar
          selectedPage={selectedPage}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          role={currentRole}
        />
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6">
          <Outlet context={{ searchTerm, role: currentRole }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
