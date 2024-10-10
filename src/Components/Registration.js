
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.css'; // Import custom CSS for additional styling if needed
import { RequestStatus } from './RequestStatus'; // Adjust the import path as needed

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      const response = await axios.post('http://localhost:8080/auth/register', {
        username, email, password, confirmPassword,isAdmin
      });

      // If registering as admin, send an admin request
      if (isAdmin) {
        const adminRequest = {
          username,
          email,
          status: RequestStatus.PENDING // Assuming RequestStatus is an enum or similar structure
        };

        const requestResponse=await axios.post('http://localhost:8080/admin/requests/pending', adminRequest);
        if (requestResponse.status !== 200) {
          throw new Error("Failed to create admin request.");
        }
        // if (requestResponse.status !== 200) {
        //   alert('Registration successful. Please wait for Admin approval.');
        // } else {
        //   alert('Registration successful, but failed to create admin request.');
        // }
        
      
      }
      
      alert("Registration successful. Check your email!");
      navigate('/login'); // Redirect to login page on success
    
      
    } catch (error) {
      alert(error.response?.data || "Registration successful. Please wait for Admin approval");
      
    }
  };

  return (
    <div className='body'>
    <div className="container1 mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleRegister} className="w-100 mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label className="form-check-label">Register as Admin</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
    </div>
  );
}

export default Registration;

