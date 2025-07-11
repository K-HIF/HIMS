import React, { useState } from 'react';
import Sidebar from '../pages/dashboard/Sidebar';
import Navbar from '../pages/dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar selectedPage={selectedPage} onSelect={setSelectedPage} />

      <div className="flex flex-col flex-1">
        <Navbar selectedPage={selectedPage} searchTerm={searchTerm} onSearch={setSearchTerm} />
        <main className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          <Outlet context={{ searchTerm }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
