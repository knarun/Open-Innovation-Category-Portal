import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import './Topbar.css';

const Topbar = () => {
  const [profileDetails, setProfileDetails] = useState({
    name: ''
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
    <div className="topbar">
      <div className="topbar-title">BIT Open Innovation Category Portal</div>
      <div className="user-info">
        <div className="user-icon">{profileDetails.name.charAt(0)}</div>
        <div className="user-name">{profileDetails.name}</div>
      </div>
    </div>
  );
};

export default Topbar;
