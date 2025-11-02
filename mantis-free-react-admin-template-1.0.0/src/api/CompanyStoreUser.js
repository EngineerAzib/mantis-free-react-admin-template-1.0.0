import axiosInstance from './axios'; // Adjust path as needed

export const GetCompany = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    console.log(`🚀 GetCompany API call starting...`);
    console.log(`📋 Parameters:`, { pageNumber, pageSize, filter });
    console.log(`🌐 Base URL:`, axiosInstance.defaults.baseURL);
    console.log(`🔗 Full URL will be:`, `${axiosInstance.defaults.baseURL}/Company/GetCompany`);
    
    const response = await axiosInstance.get('/Company/GetCompany', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null, 
      },
    });
    
    console.log(`✅ GetCompany API response received:`, response);
    console.log(`📊 Response data:`, response.data);
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error(`❌ GetCompany API error:`, error);
    console.error(`🔍 Error details:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return { items: [], totalCount: 0 };
  }
};

export const GetStore = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
   
    console.log(`GetStore called with pageNumber: ${pageNumber}, pageSize: ${pageSize}, filter:`, filter);
    const response = await axiosInstance.get('/Store/GetStore', {
      params: {
        pageNumber,
        pageSize,
         filter: filter ?? null, 
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error(`Error fetching stores:`, error);
    return { items: [], totalCount: 0 };
  }
};

export const GetUsers = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    debugger
    console.log(`GetUsers called with pageNumber: ${pageNumber}, pageSize: ${pageSize}, filter:`, filter);
    const response = await axiosInstance.get('/Auth/GetAllUser', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,  // Ensure filter is a string if provided
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error(`Error fetching users:`, error);
    return { items: [], totalCount: 0 };
  }
};

export const CompanyStoreUser = async (payload) => {
  try {
    console.log('CompanyStoreUser called with payload:', payload);
    const response = await axiosInstance.post('/Company/AddCompanyWithStoreAndUser', payload);
    return response.data; // Adjust based on actual response
  } catch (error) {
    console.error('Error adding company/store/user:', error);
    throw error;
  }
};

// Add User API
export const AddUser = async (userData) => {
  try {
    console.log('AddUser called with userData:', userData);
    const response = await axiosInstance.post('/Auth/AddUser', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Get Authorized Person Info API
export const GetAuthorizedPersonInfo = async () => {
  try {
    console.log('GetAuthorizedPersonInfo called');
    const response = await axiosInstance.get('/Company/AuthorizePerson');
    console.log('Authorized person info response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching authorized person info:', error);
    throw error;
  }
};