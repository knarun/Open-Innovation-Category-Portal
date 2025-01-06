import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectDetails } from '../services/api';
// import './ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await getProjectDetails(projectId);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to fetch project details. ' + (error.response?.data?.message || error.message));
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-details">
      <h2>Project Details</h2>
      <p><strong>Title:</strong> {project.projectTitle}</p>
      <p><strong>Status:</strong> {project.status}</p>
      {/* Display other project details here */}
    </div>
  );
};

export default ProjectDetails;
