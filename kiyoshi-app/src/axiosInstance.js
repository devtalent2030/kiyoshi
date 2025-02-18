import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Adjust to match your backend URL
});

// Request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    
    // Debug: log whether a token is found
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token attached to request:', config.headers.Authorization);
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
  (response) => {
    // Pass successful responses as is
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 (Unauthorized) - clearing token and redirecting to login.');
      localStorage.removeItem('token'); // Clear invalid token
      localStorage.removeItem('user');  // Clear user details if stored

      // Redirect to the login page (adjust the path as needed for your app)
      window.location.href = '/login';
    }

    // Pass the error to the caller
    return Promise.reject(error);
  }
);

export default axiosInstance;
