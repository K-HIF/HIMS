import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import DashboardLayout from './pages/DashboardLayout';
import NotFound from './pages/NotFound';
import Overview from './pages/dashboard/Overview';
import Doctors from './pages/dashboard/Doctors';
import Patients from './pages/dashboard/Patients';
import Departments from './pages/dashboard/Departments';
import Programs from './pages/dashboard/Programs';
import InsuranceClaims from './pages/dashboard/InsuranceClaims';
import InsuranceProviders from './pages/dashboard/InsuranceProviders';
import Profile from './pages/dashboard/Profile';
import Logout from './pages/dashboard/Logout';
import Documentation from './pages/dashboard/Documentation';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import NurseDashboard from './pages/dashboard/NurseDashboard';
import ReceptionDashboard from './pages/dashboard/ReceptionDashboard';
import CheckoutDashboard from './pages/dashboard/CheckoutDashboard';
import PharmacyDashboard from './pages/dashboard/PharmacyDashboard';
import Staff from './pages/dashboard/Staff';
import Insurance from './pages/dashboard/Insurance';
import Facilities from './pages/dashboard/Facilities';
import Testing from './pages/dashboard/Testing';
import MyPatients from './pages/dashboard/MyPatients';
import Consultations from './pages/dashboard/Consultations';
import LabRequests from './pages/dashboard/LabRequests';
import Prescriptions from './pages/dashboard/Prescriptions';
import Appointments from './pages/dashboard/Appointments';
import InPatient from './pages/dashboard/InPatient';
import Pharmacy from './pages/dashboard/Pharmacy';
import Admissions from './pages/dashboard/Admissions';
import PatientCare from './pages/dashboard/PatientCare';
import Discharge from './pages/dashboard/Discharge';
import Reports from './pages/dashboard/Reports';
import TestRequests from './pages/dashboard/TestRequests';
import Processing from './pages/dashboard/Processing';
import Inventory from './pages/dashboard/Inventory';
import Tests from './pages/dashboard/Tests';
import Notifications from './pages/dashboard/Notifications';
import Register from './pages/dashboard/Register';
import Documents from './pages/dashboard/Documents';
import Donate from './pages/dashboard/Donate';
import Billing from './pages/dashboard/Billing';
import Payments from './pages/dashboard/Payments';
import Services from './pages/dashboard/Services';

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
        <Route path="/dashboard/*" element={<RoleBasedDashboard />}> {/* Pass role to layout */}
          <Route path="admin" element={<Overview />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="nurse" element={<NurseDashboard />} />
          <Route path="reception" element={<ReceptionDashboard />} />
          <Route path="checkout" element={<CheckoutDashboard />} />
          <Route path="pharmacy" element={<PharmacyDashboard />} />
          <Route path=":role/doctors" element={<Doctors />} />
          <Route path=":role/patients" element={<Patients />} />
          <Route path=":role/departments" element={<Departments />} />
          <Route path=":role/programs" element={<Programs />} />
          <Route path=":role/insurance-claims" element={<InsuranceClaims />} />
         
          <Route path=":role/profile" element={<Profile />} />
          <Route path=":role/logout" element={<Logout />} />
          <Route path=":role/documentation" element={<Documentation />} />

          {/* Admin */}
          <Route path=":role/staff" element={<Staff />} />
          <Route path=":role/insurance" element={<InsuranceProviders />} />
          <Route path=":role/facilities" element={<Facilities />} />
          <Route path=":role/testing" element={<Testing />} />

          {/* Doctor */}
          <Route path=":role/my-patients" element={<MyPatients />} />
          <Route path=":role/consultations" element={<Consultations />} />
          <Route path=":role/lab-requests" element={<LabRequests />} />
          <Route path=":role/prescriptions" element={<Prescriptions />} />
          <Route path=":role/appointments" element={<Appointments />} />
          <Route path=":role/in-patient" element={<InPatient />} />

          {/* Nurse */}
          <Route path=":role/pharmacy" element={<Pharmacy />} />
          <Route path=":role/admissions" element={<Admissions />} />
          <Route path=":role/patient-care" element={<PatientCare />} />
          <Route path=":role/discharge" element={<Discharge />} />
          <Route path=":role/reports" element={<Reports />} />

          {/* Lab */}
          <Route path=":role/test-requests" element={<TestRequests />} />
          <Route path=":role/processing" element={<Processing />} />
          <Route path=":role/inventory" element={<Inventory />} />
          <Route path=":role/tests" element={<Tests />} />
          <Route path=":role/notifications" element={<Notifications />} />

          {/* Reception */}
          <Route path=":role/register" element={<Register />} />
          <Route path=":role/documents" element={<Documents />} />
          <Route path=":role/donate" element={<Donate />} />

          {/* Pharmacy */}
          <Route path=":role/billing" element={<Billing />} />

          {/* Checkout */}
          <Route path=":role/payments" element={<Payments />} />
          <Route path=":role/services" element={<Services />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
