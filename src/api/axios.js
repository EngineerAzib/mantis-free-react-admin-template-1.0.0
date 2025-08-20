import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7252/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

// ✅ Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  
  (config) => {
  
    const token = localStorage.getItem('authToken');
    console.log('Interceptor - Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor - Authorization Header:', config.headers.Authorization);
    }

    // Ensure Content-Type is present for POST requests
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle 401 token expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (!error.response) {
      console.error("Server is unreachable or network error");
      alert("Cannot connect to the server.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const headers = error.response?.headers;
    const isTokenExpired = error.response.headers['token-expired'] === 'true';
    const tokenExpiredHeader = headers?.['token-expired'];
    console.log('Token Expired Header:', tokenExpiredHeader);
    console.log('Error status:', status);
    console.log('Token expired:', isTokenExpired);

    if (status === 401 && isTokenExpired) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
