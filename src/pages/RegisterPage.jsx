import { useState } from 'react';
import { userApi } from '../services/api.js';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', role: 'RESTAURANT' });
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    await userApi.create(form);
    setMessage('User registered successfully.');
    setForm({ name: '', email: '', role: 'RESTAURANT' });
  };

  return (
    <div className="card p-4">
      <h4 className="mb-3">Register User</h4>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="RESTAURANT">RESTAURANT</option>
            <option value="NGO">NGO</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-success" type="submit">Save</button>
        </div>
      </form>
      {message && <div className="alert alert-success mt-3 mb-0">{message}</div>}
    </div>
  );
}

export default RegisterPage;
