import axios from 'axios';

// Get base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request Interceptor: Automatically inject Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (token expired or invalid), clear session and redirect
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sia_token');
      localStorage.removeItem('sia_user');
      
      // Check if we are not already on the login page to prevent redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
