import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Remove /api from baseURL
});

// Request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token attached to request:', config.headers.Authorization);
      console.log('Full request URL:', `${config.baseURL}${config.url}`); // Debug full URL
    } else {
      console.warn('No token found in localStorage. Request sent without Authorization header.');
    }
    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized (401) responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 (Unauthorized) - clearing token and redirecting to login.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;