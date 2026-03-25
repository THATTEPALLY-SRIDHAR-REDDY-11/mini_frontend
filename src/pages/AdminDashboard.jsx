import { useEffect, useState } from 'react';
import { driverApi, pickupApi } from '../services/api.js';

function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', vehicleNumber: '' });
  const [assignments, setAssignments] = useState({});

  const loadData = async () => {
    const [driversResponse, pickupsResponse] = await Promise.all([driverApi.list(), pickupApi.list()]);
    setDrivers(driversResponse.data);
    setPickups(pickupsResponse.data.filter((p) => p.status === 'REQUESTED'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addDriver = async (e) => {
    e.preventDefault();
    await driverApi.create(driverForm);
    setDriverForm({ name: '', phone: '', vehicleNumber: '' });
    loadData();
  };

  const assignDriver = async (pickupId) => {
    const driverId = assignments[pickupId];
    if (!driverId) {
      return;
    }
    await pickupApi.assign(pickupId, driverId);
    loadData();
  };

  return (
    <div className="card p-4">
      <h4>Admin Dashboard</h4>

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
            <th>Select Driver</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.donationId}</td>
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
