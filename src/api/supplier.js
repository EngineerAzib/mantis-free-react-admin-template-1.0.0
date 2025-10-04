import axiosInstance from './axios';

export const GetSupplier = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    const response = await axiosInstance.get('/Supplier/GetSupplier', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return { items: [], totalCount: 0 };
  }
};

export const AddSupplier = async (payload) => {
  try {
    const response = await axiosInstance.post('/Supplier/AddSupplier', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    return { success: false, message: 'Failed to create supplier' };
  }
};