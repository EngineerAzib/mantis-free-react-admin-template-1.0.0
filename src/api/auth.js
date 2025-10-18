import axios from './axios';
import axiosInstance from './axios'; // Import the customized axiosInstance
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/Auth/login', {
      Email: email,
      Password: password,
    });
    console.log('Login response:', response.data);
    // Transform response to match expected { token, user } format
    const transformedResponse = {
      token: response.data.token.result, // Extract JWT from token.result
      user: {
        id: response.data.userId,
        email, // Use the input email since backend doesn't return it
      },
    };
    console.log('Transformed response:', transformedResponse);
    return transformedResponse;
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw errorMessage;
  }
};


export const userLogout = async () => {
  try {
     // Pause here to inspect the request
    console.log('Logout Request Config:', axiosInstance.defaults.headers);
    const response = await axiosInstance.post('/Auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to Logout';
  }
};
export const ForgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/Auth/forgot-password', { email });
    console.log('ForgotPassword response:', response.data);
    return response.data;
  } catch (error) {
    console.error('ForgotPassword error:', error);
    throw error;
  }
};
export const ResetPasswordApi = async (email,password,token) => {
  try {
    const response = await axios.post('/Auth/reset-password', { email,password,token });
    console.log('ResetPassword response:', response.data);
    return response.data;
  } catch (error) {
    console.error('ResetPassword error:', error);
    throw error;
  }
};

// Register user API
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/Auth/Register', userData);
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw errorMessage;
  }
};

// Get roles API
export const getRoles = async () => {
  try {
    const response = await axios.get('/Auth/roles');
    console.log('Roles response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get roles error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roles';
    throw errorMessage;
  }
};