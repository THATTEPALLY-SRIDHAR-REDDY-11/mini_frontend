import { Navigate, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';
import NGODashboard from './pages/NGODashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';

function App() {
  return (
    <>
      <NavigationBar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
