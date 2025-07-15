import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building,
  ClipboardList,
  ShieldCheck,
  Hospital,
  FileText,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type SidebarProps = {
  selectedPage: string;
  onSelect: (page: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  role?: string;
};

// Role-based navigation items
const getNavItems = (role: string) => {
  switch (role) {
    case 'admin':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/admin` },
        { label: 'Staff', icon: <Users size={18} />, route: `/dashboard/admin/staff` },
        { label: 'Insurance', icon: <ShieldCheck size={18} />, route: `/dashboard/admin/insurance` },
        { label: 'Departments', icon: <Building size={18} />, route: `/dashboard/admin/departments` },
        { label: 'Programs', icon: <ClipboardList size={18} />, route: `/dashboard/admin/programs` },
        { label: 'Facilities', icon: <Hospital size={18} />, route: `/dashboard/admin/facilities` },
        { label: 'Testing', icon: <FileText size={18} />, route: `/dashboard/admin/testing` },
      ];
    case 'doctor':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/doctor` },
        { label: 'My Patients', icon: <Users size={18} />, route: `/dashboard/doctor/my-patients` },
        { label: 'Consultations', icon: <ClipboardList size={18} />, route: `/dashboard/doctor/consultations` },
        { label: 'Lab Requests', icon: <FileText size={18} />, route: `/dashboard/doctor/lab-requests` },
        { label: 'Prescriptions', icon: <FileText size={18} />, route: `/dashboard/doctor/prescriptions` },
        { label: 'Appointments', icon: <ClipboardList size={18} />, route: `/dashboard/doctor/appointments` },
        { label: 'In Patient', icon: <Hospital size={18} />, route: `/dashboard/doctor/in-patient` },
      ];
    case 'nurse':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/nurse` },
        { label: 'Facilities', icon: <Hospital size={18} />, route: `/dashboard/nurse/facilities` },
        { label: 'Pharmacy', icon: <FileText size={18} />, route: `/dashboard/nurse/pharmacy` },
        { label: 'Admissions', icon: <ClipboardList size={18} />, route: `/dashboard/nurse/admissions` },
        { label: 'Patient Care', icon: <Users size={18} />, route: `/dashboard/nurse/patient-care` },
        { label: 'Discharge', icon: <FileText size={18} />, route: `/dashboard/nurse/discharge` },
        { label: 'Reports', icon: <FileText size={18} />, route: `/dashboard/nurse/reports` },
      ];
    case 'lab':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/lab` },
        { label: 'Test Requests', icon: <ClipboardList size={18} />, route: `/dashboard/lab/test-requests` },
        { label: 'Processing', icon: <FileText size={18} />, route: `/dashboard/lab/processing` },
        { label: 'Reports', icon: <FileText size={18} />, route: `/dashboard/lab/reports` },
        { label: 'Inventory', icon: <FileText size={18} />, route: `/dashboard/lab/inventory` },
        { label: 'Tests', icon: <FileText size={18} />, route: `/dashboard/lab/tests` },
        { label: 'Notifications', icon: <FileText size={18} />, route: `/dashboard/lab/notifications` },
      ];
    case 'reception':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/reception` },
        { label: 'Register', icon: <Users size={18} />, route: `/dashboard/reception/register` },
        { label: 'Appointments', icon: <ClipboardList size={18} />, route: `/dashboard/reception/appointments` },
        { label: 'Documents', icon: <FileText size={18} />, route: `/dashboard/reception/documents` },
        { label: 'Reports', icon: <FileText size={18} />, route: `/dashboard/reception/reports` },
        { label: 'Notifications', icon: <FileText size={18} />, route: `/dashboard/reception/notifications` },
        { label: 'Donate', icon: <FileText size={18} />, route: `/dashboard/reception/donate` },
      ];
    case 'pharmacy':
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/pharmacy` },
        { label: 'Inventory', icon: <FileText size={18} />, route: `/dashboard/pharmacy/inventory` },
        { label: 'Prescriptions', icon: <FileText size={18} />, route: `/dashboard/pharmacy/prescriptions` },
        { label: 'Notifications', icon: <FileText size={18} />, route: `/dashboard/pharmacy/notifications` },
        { label: 'Reports', icon: <FileText size={18} />, route: `/dashboard/pharmacy/reports` },
        { label: 'Billing', icon: <FileText size={18} />, route: `/dashboard/pharmacy/billing` },
      ];
    case 'checkout':
      return [
        { label: 'Billing', icon: <FileText size={18} />, route: `/dashboard/checkout/billing` },
        { label: 'Insurance', icon: <ShieldCheck size={18} />, route: `/dashboard/checkout/insurance` },
        { label: 'Notifications', icon: <FileText size={18} />, route: `/dashboard/checkout/notifications` },
        { label: 'Reports', icon: <FileText size={18} />, route: `/dashboard/checkout/reports` },
        { label: 'Payments', icon: <FileText size={18} />, route: `/dashboard/checkout/payments` },
        { label: 'Services', icon: <FileText size={18} />, route: `/dashboard/checkout/services` },
      ];
    default:
      return [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, route: `/dashboard/admin` },
      ];
  }
};

const accountItems = [
  { label: 'Profile', icon: <UserCircle size={18} />, route: '/dashboard/:role/profile' },
  { label: 'Log Out', icon: <LogOut size={18} />, route: '/dashboard/:role/logout' },
  { label: 'Documentation', icon: <FileText size={18} />, route: '/dashboard/:role/documentation' },
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedPage,
  onSelect,
  isSidebarOpen,
  setIsSidebarOpen,
  role = 'admin',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getNavItems(role);

  const handleItemClick = (label: string, route: string) => {
    onSelect(label);
    navigate(route.replace(':role', role));
    setIsSidebarOpen(false); // close on mobile
  };

  return (
    <div
      className={`
        w-64 bg-white text-gray-800 shadow-lg
        flex flex-col overflow-y-auto scrollbar-hide
        transition-transform duration-300
        fixed top-0 left-0 h-screen z-40
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:rounded-xl md:m-4 md:h-[calc(100vh-2rem)]
      `}
    >
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={() => setIsSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>

      {/* Logo */}
      <div className="px-4 pb-4 flex items-center gap-2 border-b border-gray-200">
        <img
          src="https://img.icons8.com/arcade/64/hospital.png"
          alt="hospital"
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-gray-800">MedicApp</span>
      </div>

      {/* Navigation */}
      <ul className="p-4 space-y-4 flex-1">
        {navItems.map((item, idx) => (
          <li
            key={idx}
            onClick={() => handleItemClick(item.label, item.route)}
            className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
              selectedPage === item.label || location.pathname === item.route.replace(':role', role)
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>

      {/* Account Section */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Account</h3>
        <ul className="space-y-3">
          {accountItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleItemClick(item.label, item.route)}
              className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
                item.label === 'Log Out'
                  ? 'text-red-500 hover:text-red-700'
                  : selectedPage === item.label || location.pathname === item.route.replace(':role', role)
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
