import { Navigate, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';
import NGODashboard from './pages/NGODashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import { getCurrentUser } from './services/auth.js';

function ProtectedRoute({ role, children }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <NavigationBar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/restaurant"
            element={(
              <ProtectedRoute role="RESTAURANT">
                <RestaurantDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/ngo"
            element={(
              <ProtectedRoute role="NGO">
                <NGODashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/driver"
            element={(
              <ProtectedRoute role="DRIVER">
                <DriverDashboard />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
