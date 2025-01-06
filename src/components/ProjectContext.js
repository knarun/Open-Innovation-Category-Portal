import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectDetails, setProjectDetails] = useState({
    projectTitle: '',
    components: [],
    teamMembers: [],
    flowChart: null
  });

  // Add profile details state
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    rollNo: '',
    department: '',
    labName: '',
    phoneNo: ''
  });

  return (
    <ProjectContext.Provider value={{
      projectDetails, 
      setProjectDetails,
      profileDetails,  // Provide profile details state
      setProfileDetails // Provide function to update profile
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
