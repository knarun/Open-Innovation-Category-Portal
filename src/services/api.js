import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Projects API
export const getAllProjects = () => api.get('/projects/all');
export const getMyProject = async () => {
  try {
    const response = await api.get('/projects/my-project');
    return response;
  } catch (error) {
    console.error('Project fetch error:', error);
    throw error;
  }
};

export const registerProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response;
  } catch (error) {
    console.error('Project registration error:', error);
    throw error;
  }
};

export const updateProjectStatus = async (projectId, status) => {
  try {
    const response = await api.patch(`/projects/${projectId}/status`, { status });
    return response;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};

// Auth API
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const signUpUser = (userData) => api.post('/users/signup', userData);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.patch('/users/profile', profileData);

export default api;
