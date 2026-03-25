import { useEffect, useState } from 'react';
import { donationApi } from '../services/api.js';

function RestaurantDashboard() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ foodName: '', quantity: 1, location: '', restaurantId: '' });

  const loadDonations = async () => {
    const response = await donationApi.list();
    setDonations(response.data);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const submitDonation = async (e) => {
    e.preventDefault();
    await donationApi.create({ ...form, quantity: Number(form.quantity) });
    setForm({ foodName: '', quantity: 1, location: '', restaurantId: '' });
    loadDonations();
  };

  return (
    <div className="card p-4">
      <h4>Restaurant Dashboard</h4>
      <form onSubmit={submitDonation} className="row g-2 my-3">
        <div className="col-md-3">
          <input className="form-control" placeholder="Food Name" value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Restaurant UUID" value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })} required />
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-success">Add</button>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.foodName}</td>
              <td>{d.quantity}</td>
              <td>{d.location}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantDashboard;
