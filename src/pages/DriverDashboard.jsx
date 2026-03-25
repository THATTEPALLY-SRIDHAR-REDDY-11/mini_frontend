import { useState } from 'react';
import { pickupApi } from '../services/api.js';

function DriverDashboard() {
  const [driverId, setDriverId] = useState('');
  const [pickups, setPickups] = useState([]);
  const [message, setMessage] = useState('');

  const loadAssignedPickups = async () => {
    if (!driverId) {
      return;
    }
    const response = await pickupApi.byDriver(driverId);
    setPickups(response.data.filter((p) => p.status === 'ASSIGNED'));
  };

  const collectFood = async (pickupId) => {
    await pickupApi.collect(pickupId);
    setMessage('Delivery will complete automatically in 1 minute.');
    loadAssignedPickups();
  };

  return (
    <div className="card p-4">
      <h4>Driver Dashboard</h4>
      <div className="row my-3 g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Driver UUID" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-success" onClick={loadAssignedPickups}>Load Pickups</button>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Pickup ID</th>
            <th>Donation ID</th>
            <th>Status</th>
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
                <button className="btn btn-warning btn-sm" onClick={() => collectFood(p.id)}>
                  Collect Food
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverDashboard;
