import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRDashboard from './pages/HRDashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/hr" element={<HRDashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;