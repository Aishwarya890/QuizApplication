import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminApprova.css'

function AdminApprovalPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending requests from the server
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const response = await axios.get('http://localhost:8080/admin/requests/pending');
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        alert(`Failed to load pending requests: ${error.response?.data?.message || error.message}`);
      }
      setLoading(false); // Stop loading once the data is fetched
    };
    fetchRequests();
  }, []);

  // Approve a request
  axios.defaults.withCredentials = true;
  const approveRequest = async (id) => {
    try {
      await axios.post(`http://localhost:8080/admin/requests/approve/${id}`);
      setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the approved request from the list
      alert("Request approved!");
    } catch (error) {
      alert(`Failed to approve request: ${error.response?.data?.message || error.message}`);
    }
  };

  // Reject a request
  const rejectRequest = async (id) => {
    try {
      await axios.post(`http://localhost:8080/admin/requests/reject/${id}`);
      setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the rejected request from the list
      alert("Request rejected!");
    } catch (error) {
      alert(`Failed to reject request: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className='body1'>
    <div className="container7 mt-5">
      <h2 className="text-center">Pending Admin Requests</h2>

      {/* Display a loading spinner while data is being fetched */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length > 0 ? pendingRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.username}</td>
                <td>{request.email}</td>
                <td>
                  <button className="btn btn-success me-2" onClick={() => approveRequest(request.id)}>Approve</button>
                  <button className="btn btn-danger" onClick={() => rejectRequest(request.id)}>Reject</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center">No pending requests</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

export default AdminApprovalPage;
