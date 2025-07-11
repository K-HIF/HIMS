// src/components/Sidebar.tsx
import React from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  Building,
  ClipboardList,
  ShieldCheck,
  Hospital,
  FileText,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  route: string;
};

const mainNavItems: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: '/dashboard' },
  { label: 'Doctors', icon: <User size={18} />, route: '/dashboard/doctors' },
  { label: 'Patients', icon: <Users size={18} />, route: '/dashboard/patients' },
  { label: 'Departments', icon: <Building size={18} />, route: '/dashboard/departments' },
  { label: 'Programs', icon: <ClipboardList size={18} />, route: '/dashboard/programs' },
  { label: 'Insurance Claims', icon: <ShieldCheck size={18} />, route: '/dashboard/insurance-claims' },
  { label: 'Insurance Providers', icon: <Hospital size={18} />, route: '/dashboard/insurance-providers' },
];

const accountItems: SidebarItem[] = [
  { label: 'Profile', icon: <UserCircle size={18} />, route: '/dashboard/profile' },
  { label: 'Log Out', icon: <LogOut size={18} />, route: '/dashboard/logout' },
  { label: 'Documentation', icon: <FileText size={18} />, route: '/dashboard/documentation' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-white text-gray-800 shadow-lg rounded-xl m-4 overflow-hidden flex flex-col overflow-y-auto scrollbar-hide">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b border-gray-200">
        <img
          src="https://img.icons8.com/arcade/64/hospital.png"
          alt="hospital"
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-gray-800">MedicApp</span>
      </div>

      {/* Navigation */}
      <ul className="p-4 space-y-4 flex-1">
        {mainNavItems.map((item, idx) => (
          <li
            key={idx}
            onClick={() => navigate(item.route)}
            className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
              location.pathname === item.route
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>

      {/* Account */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Account</h3>
        <ul className="space-y-3">
          {accountItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => navigate(item.route)}
              className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
                item.label === 'Log Out'
                  ? 'text-red-500 hover:text-red-700'
                  : location.pathname === item.route
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
