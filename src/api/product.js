import axiosInstance from './axios'; // Import GetCategory from category.js

export const getCompanies = async () => {
  try {
    debugger
    const response = await axiosInstance.get('/Company/GetAllCompanies');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getStoresByCompany = async (companyId) => {
  try {
    const response = await axiosInstance.get('/Store/GetAllStores', { params: { companyId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};

export const GetProduct = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    const response = await axiosInstance.get('/Product/GetProduct', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error('Error fetching product:', error);
    return { items: [], totalCount: 0 };
  }
};

export const AddProduct = async (payload) => {
  try {
    const response = await axiosInstance.post('/Product/AddProduct', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'Failed to create product' };
  }
};


export const GetCategory = async (storeId) => {
  try {
    debugger
    const response = await axiosInstance.get('/Category/GetAllCategory', { params: { storeId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};
// Export GetCategory for use in ProductPage