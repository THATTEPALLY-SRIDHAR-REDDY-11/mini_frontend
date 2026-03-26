import { useEffect, useState } from 'react';
import { driverApi, pickupApi } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';

function AdminDashboard() {
  const user = getCurrentUser();
  const [drivers, setDrivers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', vehicleNumber: '' });
  const [assignments, setAssignments] = useState({});
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [driversResponse, pickupsResponse] = await Promise.all([driverApi.list(), pickupApi.list()]);
    setDrivers(driversResponse.data);
    setPickups((pickupsResponse.data || []).filter((p) => p.status === 'REQUESTED' || p.status === 'ASSIGNED'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addDriver = async (e) => {
    e.preventDefault();
    await driverApi.create(driverForm);
    setDriverForm({ name: '', phone: '', vehicleNumber: '' });
    setMessage('Driver added successfully.');
    loadData();
  };

  const assignDriver = async (pickupId) => {
    const driverId = assignments[pickupId];
    if (!driverId) {
      return;
    }
    await pickupApi.assign(pickupId, driverId);
    setMessage('Driver assigned successfully.');
    loadData();
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h4>Admin Dashboard</h4>
      <div className="alert alert-light border mt-2">Logged in as: <strong>{user?.name}</strong> ({user?.role})</div>
      {message && <div className="alert alert-success">{message}</div>}

      <h6 className="mt-3">Add Driver</h6>
      <form onSubmit={addDriver} className="row g-2 my-2">
        <div className="col-md-3">
          <input className="form-control" placeholder="Name" value={driverForm.name} onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Phone" value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Vehicle Number" value={driverForm.vehicleNumber} onChange={(e) => setDriverForm({ ...driverForm, vehicleNumber: e.target.value })} required />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-success">Add Driver</button>
        </div>
      </form>

      <h6 className="mt-4">Assign Driver to Pickup</h6>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Pickup ID</th>
            <th>Donation ID</th>
            <th>Status</th>
            <th>Select Driver</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.donationId}</td>
              <td>{p.status}</td>
              <td>
                <select
                  className="form-select"
                  value={assignments[p.id] || ''}
                  onChange={(e) => setAssignments({ ...assignments, [p.id]: e.target.value })}
                >
                  <option value="">Select driver</option>
                  {drivers.filter((d) => d.status === 'AVAILABLE').map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.vehicleNumber})</option>
                  ))}
                </select>
              </td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => assignDriver(p.id)}>
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
