import React, { useState } from 'react';
import './RegisterPage.css';
import { registerProject } from '../services/api'; // Import the API function

const RegisterPage = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [components, setComponents] = useState([{ name: '', quantity: '', productLink: '', price: '' }]);
  const [teamMembers, setTeamMembers] = useState(['']);
  const [flowChart, setFlowChart] = useState(null); // New state for flow chart

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(''); // Define setError

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...components];
    updatedComponents[index][field] = value;
    setComponents(updatedComponents);
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = value;
    setTeamMembers(updatedMembers);
  };

  const handleAddComponent = () => {
    setComponents([...components, { name: '', quantity: '', productLink: '', price: '' }]);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const handleFlowChartUpload = (e) => {
    setFlowChart(e.target.files[0]); // Save the uploaded file to state
  };

  const handleSubmit = async () => {
    if (!projectTitle || teamMembers.some(member => !member)) {
      setError('Project title and team members are required.');
      return;
    }
    try {
      const flowChartURL = flowChart ? URL.createObjectURL(flowChart) : null;

      const projectData = {
        projectTitle,
        components,
        teamMembers,
        flowChart: flowChartURL
      };

      const response = await registerProject(projectData);
      setSuccessMessage('Project registered successfully!');
      setError('');
      console.log('Project Registered:', response.data);
    } catch (error) {
      console.error('Error registering project:', error);
      setError('Failed to register project. ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="register-page">
      <h2>Register Your Project</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>} {/* Display error message */}

      <div className="form-group">
        <label>Project Title</label>
        <input 
          type="text" 
          value={projectTitle} 
          onChange={(e) => setProjectTitle(e.target.value)} 
          required
        />
      </div>

      <div className="form-group">
        <h3>Components</h3>
        {components.map((component, index) => (
          <div key={index} className="component-row">
            <input
              type="text"
              placeholder="Component Name"
              value={component.name}
              onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Quantity"
              value={component.quantity}
              onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Product Link"
              value={component.productLink}
              onChange={(e) => handleComponentChange(index, 'productLink', e.target.value)}
            />
            <input
              type="text"
              placeholder="Price"
              value={component.price}
              onChange={(e) => handleComponentChange(index, 'price', e.target.value)}
              required
            />
          </div>
        ))}
        <button onClick={handleAddComponent}>Add Component</button>
      </div>

      <div className="form-group">
        <h3>Team Members</h3>
        {teamMembers.map((member, index) => (
          <input
            key={index}
            type="text"
            placeholder="Team Member Name"
            value={member}
            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
            required
          />
        ))}
        <button onClick={handleAddTeamMember}>Add Team Member</button>
      </div>

      <div className="form-group">
        <label>Upload Flow Chart</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFlowChartUpload} 
        />
      </div>

      <button onClick={handleSubmit}>Register Project</button>
    </div>
  );
};

export default RegisterPage;
