import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    rollNo: '',
    department: '',
    labName: '',
    labCode: '',
    phoneNo: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to fetch profile. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.rollNo || !profile.department || !profile.labName || !profile.labCode || !profile.phoneNo) {
      setErrorMessage('All fields are required.');
      return;
    }
    try {
      const response = await updateUserProfile(profile);
      setProfile(response.data);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. ' + (error.response?.data?.message || error.message));
      setSuccessMessage('');
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile Page</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Roll No</label>
          <input type="text" name="rollNo" value={profile.rollNo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" name="department" value={profile.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Lab Name</label>
          <input type="text" name="labName" value={profile.labName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Lab Code</label>
          <input type="text" name="labCode" value={profile.labCode} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <input type="text" name="phoneNo" value={profile.phoneNo} onChange={handleChange} required />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
