import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import Login from './components/Login';
import YourProject from './components/YourProject';
import { ProjectProvider } from './components/ProjectContext';
import AdminPage from './components/AdminPage';
import SignUp from './components/SignUp';

const App = () => {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Topbar />
                <Dashboard />
              </div>
            </div>
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/yourproject" element={<YourProject />} />
          <Route path="/admin/yourproject" element={<YourProject isAdmin={true} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ProjectProvider>
  );
};

export default App;
