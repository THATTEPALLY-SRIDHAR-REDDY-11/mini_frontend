import { useEffect, useState } from 'react';
import { driverApi, pickupApi } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';
import AIChatSearch from '../components/AIChatSearch.jsx';

function DriverDashboard() {
  const user = getCurrentUser();
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState('');
  const [pickups, setPickups] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadDrivers = async () => {
      const { data } = await driverApi.list();
      setDrivers(data || []);
      if ((data || []).length > 0) {
        setDriverId(data[0].id);
      }
    };

    loadDrivers();
  }, []);

  const loadAssignedPickups = async () => {
    if (!driverId) {
      return;
    }
    const response = await pickupApi.byDriver(driverId);
    setPickups((response.data || []).filter((p) => p.status === 'ASSIGNED' || p.status === 'COLLECTED' || p.status === 'DELIVERED'));
  };

  const collectFood = async (pickupId) => {
    await pickupApi.collect(pickupId);
    setMessage('Delivery will automatically complete in 1 minute.');
    loadAssignedPickups();
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h4>Driver Dashboard</h4>
      <div className="alert alert-light border mt-2">Logged in as: <strong>{user?.name}</strong> ({user?.role})</div>
      <div className="row my-3 g-2">
        <div className="col-md-6">
          <select className="form-select" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {(drivers || []).map((driver) => (
              <option key={driver.id} value={driver.id}>{driver.name} ({driver.vehicleNumber})</option>
            ))}
          </select>
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
            <th>Pickup Time</th>
            <th>Delivery Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.donationId}</td>
              <td>{p.pickupTime ? new Date(p.pickupTime).toLocaleString() : '-'}</td>
              <td>{p.deliveryTime ? new Date(p.deliveryTime).toLocaleString() : '-'}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'ASSIGNED' ? (
                  <button className="btn btn-warning btn-sm" onClick={() => collectFood(p.id)}>
                    Collect Food
                  </button>
                ) : (
                  <span className="text-muted">No action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AIChatSearch role={user?.role} userId={user?.id} />
    </div>
  );
}

export default DriverDashboard;
