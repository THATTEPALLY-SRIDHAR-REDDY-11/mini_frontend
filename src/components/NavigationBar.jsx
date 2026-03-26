import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { clearCurrentUser, getCurrentUser } from '../services/auth.js';

function NavigationBar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <span className="navbar-brand fw-bold">Smart Food Waste Management</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/login">Login</Link>
            {user?.role === 'RESTAURANT' && <Link className="nav-link" to="/restaurant">Dashboard</Link>}
            {user?.role === 'NGO' && <Link className="nav-link" to="/ngo">Dashboard</Link>}
            {user?.role === 'ADMIN' && <Link className="nav-link" to="/admin">Dashboard</Link>}
            {user?.role === 'DRIVER' && <Link className="nav-link" to="/driver">Dashboard</Link>}
            {user && (
              <button type="button" className="btn btn-sm btn-light ms-3" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
