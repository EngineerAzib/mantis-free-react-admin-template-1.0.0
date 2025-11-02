import axiosInstance from './axios';

export const getCompanies = async () => {
  try {
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

export const GetStaff = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    const response = await axiosInstance.get('/Staff/GetStaff', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error('Error fetching staff:', error);
    return { items: [], totalCount: 0 };
  }
};

export const AddStaff = async (payload) => {
  try {
    const response = await axiosInstance.post('/Staff/AddStaff', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    return { success: false, message: 'Failed to create staff' };
  }
};