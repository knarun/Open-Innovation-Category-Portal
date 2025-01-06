import React, { useEffect, useState } from 'react';
import './YourProject.css';
import { getMyProject, updateProjectStatus } from '../services/api';

const YourProject = ({ isAdmin, refresh }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchProject = async () => {
        try {
            const response = await getMyProject();
            setProjectDetails(response.data);
            console.log('Fetched Project Details:', response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
            setError('' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchProject();
    }, [refresh]);

    const handleStatusChange = async (newStatus) => {
        if (!projectDetails) return;
        const projectId = projectDetails._id;
        console.log('Updating project ID:', projectId);
        try {
            await updateProjectStatus(projectId, newStatus);
            setSuccessMessage(`Project status updated to ${newStatus}`);
            fetchProject();
        } catch (error) {
            console.error('Error updating project status:', error);
            setError(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!projectDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="your-project">
            <h2>Project Title: {projectDetails.projectTitle}</h2>
            <h3>Status: {projectDetails.status}</h3>
            <div>
                <h4>Components:</h4>
                <ul>
                    {projectDetails.components.map((component, index) => (
                        <li key={index}>
                            {component.name} - Quantity: {component.quantity}, Price: {component.price}, Product Link: <a href={component.productLink} target="_blank" rel="noopener noreferrer">Link</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4>Team Members:</h4>
                <ul className="team-members-list">
                    {projectDetails.teamMembers.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
            {projectDetails.flowChart ? (
                <div className="section">
                    <h4>Flow Chart:</h4>
                    <div className="flow-chart-container">
                        <img 
                            src={projectDetails.flowChart} 
                            alt="Flow Chart" 
                            onError={() => console.error('Error loading flow chart image')}
                        />
                    </div>
                </div>
            ) : (
                <div>No flow chart available.</div>
            )}
            {isAdmin && (
                <div className="status-buttons">
                    <button onClick={() => handleStatusChange('Approved')}>Approve</button>
                    <button onClick={() => handleStatusChange('Rejected')}>Reject</button>
                </div>
            )}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default YourProject;
