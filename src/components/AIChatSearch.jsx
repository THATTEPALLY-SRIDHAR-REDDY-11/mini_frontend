import { useState } from 'react';
import { aiApi } from '../services/api.js';

function AIChatSearch({ role, userId }) {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setStatusMessage('');

    try {
      const { data } = await aiApi.search({
        message,
        role,
        userId
      });

      setRows(data?.records || []);
      setStatusMessage(data?.message || 'No matching records found');
    } catch {
      setRows([]);
      setStatusMessage('Unable to process search right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h5 className="mb-3">Smart Order Search Chatbot</h5>
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-10">
            <input
              className="form-control"
              placeholder="Type search like 'assigned orders'"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Send'}
            </button>
          </div>
        </form>

        {statusMessage && (
          <div className={`alert mt-3 ${rows.length > 0 ? 'alert-success' : 'alert-warning'}`}>
            {statusMessage}
          </div>
        )}

        <div className="table-responsive" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <table className="table table-striped table-bordered mt-2 mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Food Name</th>
                <th>Status</th>
                <th>Pickup Time</th>
                <th>Delivery Time</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.foodName || '-'}</td>
                  <td>{row.status || '-'}</td>
                  <td>{row.pickupTime ? new Date(row.pickupTime).toLocaleString() : '-'}</td>
                  <td>{row.deliveryTime ? new Date(row.deliveryTime).toLocaleString() : '-'}</td>
                  <td>{row.createdDate ? new Date(row.createdDate).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No records to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AIChatSearch;
