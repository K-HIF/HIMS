import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import DashboardLayout from './pages/DashboardLayout';
import NotFound from './pages/NotFound';
import Overview from './pages/dashboard/admin/Overview';
//import Patients from './pages/dashboard/Patients';
import Departments from './pages/dashboard/admin/Departments';
import Programs from './pages/dashboard/admin/Programs';
import InsuranceClaims from './pages/dashboard/InsuranceClaims';
import InsuranceProviders from './pages/dashboard/admin/InsuranceProviders';
import Profile from './pages/dashboard/Profile';
import Logout from './pages/dashboard/Logout';
import Documentation from './pages/dashboard/Documentation';
import DoctorDashboard from './pages/dashboard/doc/DoctorDashboard';
import NurseDashboard from './pages/dashboard/nurse/NurseDashboard';
import ReceptionDashboard from './pages/dashboard/reception/ReceptionDashboard';
import CheckoutDashboard from './pages/dashboard/billing/CheckoutDashboard';
import PharmacyDashboard from './pages/dashboard/pharmacy/PharmacyDashboard';
import LabDashboard from './pages/dashboard/lab/LaboratoryDashboard.tsx';
import Staff from './pages/dashboard/admin/Staff';
import Facilities from './pages/dashboard/admin/Facilities';
import Testing from './pages/dashboard/admin/Testing';
import MyPatients from './pages/dashboard/doc/MyPatients';
import Consultations from './pages/dashboard/doc/Consultations';
import LabRequests from './pages/dashboard/doc/LabRequests';
import Prescriptions from './pages/dashboard/doc/Prescriptions';
import Appointments from './pages/dashboard/doc/Appointments';
import InPatient from './pages/dashboard/doc/InPatient';
import Pharmacy from './pages/dashboard/nurse/Pharmacy';
import Admissions from './pages/dashboard/nurse/Admissions';
import PatientCare from './pages/dashboard/nurse/PatientCare';
import Discharge from './pages/dashboard/nurse/Discharge';
import Reports from './pages/dashboard/nurse/Reports';
import TestRequests from './pages/dashboard/lab/TestRequests';
import Processing from './pages/dashboard/lab/Processing';
import Inventory from './pages/dashboard/lab/Inventory';
import Tests from './pages/dashboard/lab/Tests';
import Notifications from './pages/dashboard/lab/Notifications';
import Register from './pages/dashboard/reception/Register';
import Documents from './pages/dashboard/Documents';
import Donate from './pages/dashboard/reception/Donate';
import Billing from './pages/dashboard/billing/Billing';
import Payments from './pages/dashboard/billing/Payments';
import Services from './pages/dashboard/billing/Services';

// Helper to get current role from localStorage
const getCurrentRole = () => {
  return localStorage.getItem('role') || 'admin';
};

const RoleBasedDashboard = () => {
  const location = useLocation();
  const role = getCurrentRole();
  // Redirect to role-based dashboard if not already there
  if (location.pathname === '/dashboard') {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  return <DashboardLayout role={role} />;
};

const App = () => {
    
  return (
   
    
      <>
      
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Role-based dashboard routing */}
          <Route path="/dashboard/*" element={<RoleBasedDashboard />}>
            {/* Admin Routes */}
            <Route path="admin" element={<Overview />} />
            <Route path="admin/departments" element={<Departments />} />
            <Route path="admin/programs" element={<Programs />} />
            <Route path="admin/insurance-claims" element={<InsuranceClaims />} />
            <Route path="admin/profile" element={<Profile />} />
            <Route path="admin/logout" element={<Logout />} />
            <Route path="admin/documentation" element={<Documentation />} />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/insurance" element={<InsuranceProviders />} />
            <Route path="admin/facilities" element={<Facilities />} />
            <Route path="admin/testing" element={<Testing />} />

            {/* Doctor Routes */}
            <Route path="doctor" element={<DoctorDashboard />} />
            <Route path="doctor/my-patients" element={<MyPatients />} />
            <Route path="doctor/consultations" element={<Consultations />} />
            <Route path="doctor/lab-requests" element={<LabRequests />} />
            <Route path="doctor/prescriptions" element={<Prescriptions />} />
            <Route path="doctor/appointments" element={<Appointments />} />
            <Route path="doctor/in-patient" element={<InPatient />} />
            <Route path="doctor/logout" element={<Logout />} />

            {/* Nurse Routes */}
            <Route path="nurse" element={<NurseDashboard />} />
            <Route path="nurse/pharmacy" element={<Pharmacy />} />
            <Route path="nurse/admissions" element={<Admissions />} />
            <Route path="nurse/patient-care" element={<PatientCare />} />
            <Route path="nurse/discharge" element={<Discharge />} />
            <Route path="nurse/reports" element={<Reports />} />
            <Route path="nurse/logout" element={<Logout />} />


            {/* Reception Routes */}
            <Route path="reception" element={<ReceptionDashboard />} />
            <Route path="reception/register" element={<Register />} />
            <Route path="reception/documents" element={<Documents />} />
            <Route path="reception/donate" element={<Donate />} />
            <Route path="reception/logout" element={<Logout />} />

            {/* Checkout and Pharmacy Routes */}
            <Route path="checkout" element={<CheckoutDashboard />} />
            <Route path="checkout/payments" element={<Payments />} />
            <Route path="checkout/services" element={<Services />} />
            <Route path="checkout/logout" element={<Logout />} />

            {/* Pharmacy Dashboard */}
            <Route path="pharmacy" element={<PharmacyDashboard />} />
            <Route path="pharmacy/logout" element={<Logout />} />
            <Route path="pharmacy/billing" element={<Billing />} />

            {/* Laboratory Routes */} 
            <Route path="lab" element={<LabDashboard />} />
            <Route path="lab/test-requests" element={<TestRequests />} />
            <Route path="lab/processing" element={<Processing />} />
            <Route path="lab/inventory" element={<Inventory />} />
            <Route path="lab/tests" element={<Tests />} />
            <Route path="lab/notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </>
    
  );
};

export default App;