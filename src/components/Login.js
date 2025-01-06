import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { loginUser } from '../services/api';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setIsPopupOpen(true);
    setError('');
    setUserId('');
    setPassword('');
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({ name: userId, password });
      const { token, isAdmin } = response.data;
      
      console.log('Login successful, setting token:', token);
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin);

      // Navigate after confirming token is set
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken);

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    console.log(decoded);
    if (decoded.email) {
      navigate(`/${selectedRole}`);
      setIsPopupOpen(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google sign-in failed:', error);
    setError('Google sign-in failed. Please try again.');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="container">
        <h1>Open Innovation Category</h1>
        <div className="button-group">
          <button className="button" onClick={() => handleRoleClick('user')}>User Login</button>
          <button className="button" onClick={() => handleRoleClick('admin')}>Admin Login</button>
        </div>

        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={closePopup}>X</button>
              <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
              <input
                type="text"
                placeholder={`Enter ${selectedRole === 'user' ? 'User' : 'Admin'} ID`}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="button" onClick={handleLogin}>Login</button>
              {error && <div className="error">{error}</div>}

              <div className="google-login">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>

              <div className="signup-link">
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
