import { useEffect, useState } from 'react';
import { donationApi } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';

function RestaurantDashboard() {
  const user = getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({ foodName: '', quantity: 1, location: '' });

  const loadDonations = async (status = filterStatus, date = filterDate) => {
    if (!user?.id) {
      return;
    }

    const params = { restaurantId: user.id };
    if (status) params.status = status;
    if (date) params.date = date;

    const response = await donationApi.list(params);
    setDonations(response.data || []);
  };

  useEffect(() => {
    loadDonations('', '');
  }, [user?.id]);

  const submitDonation = async (e) => {
    e.preventDefault();
    await donationApi.create({ ...form, quantity: Number(form.quantity), restaurantId: user.id });
    setForm({ foodName: '', quantity: 1, location: '' });
    loadDonations();
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h4 className="mb-3">Restaurant Dashboard</h4>

      <div className="alert alert-light border">Logged in as: <strong>{user?.name}</strong> ({user?.role})</div>

      <h5 className="mt-2">Add Donation</h5>
      <form onSubmit={submitDonation} className="row g-2 my-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Food Name" value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-success">Add</button>
        </div>
      </form>

      <div className="row g-2 mt-2">
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="COLLECTED">COLLECTED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-outline-success" onClick={() => loadDonations()}>Apply Filters</button>
        </div>
      </div>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.foodName}</td>
              <td>{d.quantity}</td>
              <td>{d.location}</td>
              <td>{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantDashboard;
