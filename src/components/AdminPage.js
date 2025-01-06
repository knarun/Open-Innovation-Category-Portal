import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, updateProjectStatus } from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProjects();
      console.log('Fetched Projects:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setError(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');
    
    if (!isAdmin || !token) {
      navigate('/login');
      return;
    }
    
    fetchProjects();
  }, [navigate, fetchProjects]);

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      setError(''); // Clear any previous error messages
      fetchProjects(); // Refresh the list after status update
    } catch (error) {
      console.error('Status update error:', error);
      setError('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login'; // Redirect to login page
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      {error && <div className="error-message">{error}</div>}
      <div className="projects-list">
        {projects.length === 0 ? (
          <div className="no-projects">No projects found</div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.projectTitle}</h3>
              <h5>Team Leader: {project.userId?.name || 'Unknown'}</h5>
              <p>Roll No: {project.userId?.rollNo || 'N/A'}</p>
              <div className={`status-badge ${project.status.toLowerCase()}`}>
                Status: {project.status}
              </div>
              
              <div className="section">
                <h4>Components:</h4>
                <ul>
                  {project.components.map((component, index) => (
                    <li key={index}>{component.name} - Quantity: {component.quantity}, Price: {component.price}</li>
                  ))}
                </ul>
              </div>

              <div className="section">
                <h4>Team Members:</h4>
                <ul>
                  {project.teamMembers.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>

              {project.flowChart &&(
                <div className="section">
                  <h4>Flow Chart:</h4>
                  <div className="flow-chart-container">
                        <img 
                            src={project.flowChart} 
                            alt="Flow Chart" 
                            onError={() => console.error('Error loading flow chart image')}
                        />
                    </div>
                </div>
              )}

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(project._id, 'Approved')}
                  disabled={project.status === 'Approved'}
                >Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(project._id, 'Rejected')}
                  disabled={project.status === 'Rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
