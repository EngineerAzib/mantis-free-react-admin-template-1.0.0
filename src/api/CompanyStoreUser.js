import axiosInstance from './axios'; // Adjust path as needed

export const GetCompany = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    debugger
    console.log(`GetCompany called with pageNumber: ${pageNumber}, pageSize: ${pageSize}, filter:`, filter);
    const response = await axiosInstance.get('/Company/GetCompany', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null, 
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error(`Error fetching companies:`, error);
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