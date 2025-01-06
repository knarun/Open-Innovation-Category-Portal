import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    rollNo: '',
    department: '',
    labName: '',
    phoneNo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const response = await getUserProfile();
      setProfileDetails(response.data);
    } catch (error) {
      console.error('Error fetching profile details:', error);
      setError('Failed to fetch profile details. ' + (error.response?.data?.message || error.message));
    }
  };

  

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-info">
        <h2>Profile Information</h2>
        <p><strong>Name:</strong> {profileDetails.name}</p>
        <p><strong>Roll No:</strong> {profileDetails.rollNo}</p>
        <p><strong>Department:</strong> {profileDetails.department}</p>
        <p><strong>Lab Name:</strong> {profileDetails.labName}</p>
        <p><strong>Phone No:</strong> {profileDetails.phoneNo}</p>
      </div>
    </div>
  );
};

export default Dashboard;
