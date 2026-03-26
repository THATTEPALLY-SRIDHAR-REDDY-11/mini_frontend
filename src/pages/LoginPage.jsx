import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api.js';
import { setCurrentUser } from '../services/auth.js';

const roles = ['RESTAURANT', 'NGO', 'ADMIN', 'DRIVER'];

function LoginPage() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'RESTAURANT' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const redirectByRole = (role) => {
    if (role === 'RESTAURANT') navigate('/restaurant');
    if (role === 'NGO') navigate('/ngo');
    if (role === 'ADMIN') navigate('/admin');
    if (role === 'DRIVER') navigate('/driver');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await userApi.login(loginForm);
      if (!data) {
        setError('Invalid email or password.');
        return;
      }

      setCurrentUser(data);
      redirectByRole(data.role);
    } catch {
      setError('Unable to login. Please verify backend availability.');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await userApi.create(registerForm);
      setMessage('Registration successful. You can login now.');
      setRegisterForm({ name: '', email: '', password: '', role: 'RESTAURANT' });
    } catch {
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <div className="row g-4 align-items-start">
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body p-4">
            <h3 className="mb-3">Login</h3>
            <p className="text-muted">Use your role account to access your dashboard.</p>
            <form onSubmit={handleLogin} className="row g-3">
              <div className="col-12">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 d-grid">
                <button type="submit" className="btn btn-success">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body p-4">
            <h3 className="mb-3">Create Account</h3>
            <p className="text-muted">Register users for Restaurant, NGO, Admin, or Driver roles.</p>
            <form onSubmit={handleRegister} className="row g-3">
              <div className="col-12">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="col-12 d-grid">
                <button type="submit" className="btn btn-outline-success">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {(error || message) && (
        <div className="col-12">
          <div className={`alert ${error ? 'alert-danger' : 'alert-success'} mb-0`}>
            {error || message}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
