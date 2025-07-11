import { Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
      
        <Route index element={<Overview />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="departments" element={<Departments />} />
        <Route path="programs" element={<Programs />} />
        <Route path="insurance-claims" element={<InsuranceClaims />} />
        <Route path="insurance-providers" element={<InsuranceProviders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="logout" element={<Logout />} />
        <Route path="documentation" element={<Documentation />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
