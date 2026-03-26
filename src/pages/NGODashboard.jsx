import { useEffect, useState } from 'react';
import { donationApi, pickupApi } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';
import AIChatSearch from '../components/AIChatSearch.jsx';

function NGODashboard() {
  const user = getCurrentUser();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);

  const loadDonations = async () => {
    const response = await donationApi.list({ status: 'AVAILABLE' });
    setAvailableDonations(response.data || []);
  };

  const loadHistory = async () => {
    if (!user?.id) {
      return;
    }

    const [pickupResponse, donationResponse] = await Promise.all([
      pickupApi.byNgo(user.id),
      donationApi.list()
    ]);

    const donationMap = (donationResponse.data || []).reduce((acc, donation) => {
      acc[donation.id] = donation;
      return acc;
    }, {});

    const rows = (pickupResponse.data || []).map((pickup) => ({
      ...pickup,
      donation: donationMap[pickup.donationId]
    }));

    rows.sort((a, b) => {
      const aDate = a.deliveryTime || a.pickupTime || a.donation?.createdAt || '';
      const bDate = b.deliveryTime || b.pickupTime || b.donation?.createdAt || '';
      return String(bDate).localeCompare(String(aDate));
    });

    setHistoryRows(rows);
  };

  useEffect(() => {
    loadDonations();
    loadHistory();
  }, [user?.id]);

  return (
    <div className="card p-4 shadow-sm border-0">
      <h4 className="mb-3">NGO Dashboard</h4>
      <div className="alert alert-light border">Logged in as: <strong>{user?.name}</strong> ({user?.role})</div>

      <h5 className="mt-3">Available Donations</h5>
      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableDonations.map((d) => (
            <tr key={d.id}>
              <td>{d.foodName}</td>
              <td>{d.quantity}</td>
              <td>{d.location}</td>
              <td>{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={async () => {
                  await pickupApi.create({ donationId: d.id, ngoId: user.id });
                  await Promise.all([loadDonations(), loadHistory()]);
                }}>
                  Request Pickup
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-4">Donation History (Date-wise)</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Pickup Time</th>
            <th>Delivery Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {historyRows.map((row) => (
            <tr key={row.id}>
              <td>{row.donation?.foodName || '-'}</td>
              <td>{row.donation?.quantity ?? '-'}</td>
              <td>{row.pickupTime ? new Date(row.pickupTime).toLocaleString() : '-'}</td>
              <td>{row.deliveryTime ? new Date(row.deliveryTime).toLocaleString() : '-'}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AIChatSearch role={user?.role} userId={user?.id} />
    </div>
  );
}

export default NGODashboard;
