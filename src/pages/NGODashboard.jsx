import { useEffect, useState } from 'react';
import { donationApi, pickupApi } from '../services/api.js';

function NGODashboard() {
  const [donations, setDonations] = useState([]);
  const [ngoId, setNgoId] = useState('');

  const loadDonations = async () => {
    const response = await donationApi.list();
    setDonations(response.data.filter((d) => d.status === 'AVAILABLE'));
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const requestPickup = async (donationId) => {
    if (!ngoId) {
      return;
    }
    await pickupApi.create({ donationId, ngoId });
    loadDonations();
  };

  return (
    <div className="card p-4">
      <h4>NGO Dashboard</h4>
      <div className="row my-3">
        <div className="col-md-4">
          <input className="form-control" placeholder="NGO UUID" value={ngoId} onChange={(e) => setNgoId(e.target.value)} />
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.foodName}</td>
              <td>{d.quantity}</td>
              <td>{d.location}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => requestPickup(d.id)}>
                  Request Pickup
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NGODashboard;
