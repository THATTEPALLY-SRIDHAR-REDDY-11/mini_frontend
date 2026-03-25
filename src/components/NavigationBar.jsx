import { Link } from 'react-router-dom';

function NavigationBar() {
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
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/restaurant">Restaurant</Link>
            <Link className="nav-link" to="/ngo">NGO</Link>
            <Link className="nav-link" to="/admin">Admin</Link>
            <Link className="nav-link" to="/driver">Driver</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
