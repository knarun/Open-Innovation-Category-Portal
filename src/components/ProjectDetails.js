import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails, updateProjectStatus } from '../services/api';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await getProjectDetails(projectId);
      setProject(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to fetch project details. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      setSuccessMessage(`Project status updated to ${newStatus}`);
      fetchProjectDetails(); // Refresh project details
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Failed to update project status. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-details">
      <button onClick={handleBack}>Back to Admin Dashboard</button>
      <h2>Project Details</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <p><strong>Title:</strong> {project.projectTitle}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <div className="status-buttons">
        <button onClick={() => handleStatusChange('Approved')} disabled={project.status === 'Approved'}>Approve</button>
        <button onClick={() => handleStatusChange('Rejected')} disabled={project.status === 'Rejected'}>Reject</button>
      </div>
      {/* Display other project details here */}
    </div>
  );
};

export default ProjectDetails;
