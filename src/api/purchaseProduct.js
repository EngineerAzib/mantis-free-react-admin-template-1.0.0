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

export const GetPurchaseProduct = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    const response = await axiosInstance.get('/PurchaseOrder/GetPurchaseOrder', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error('Error fetching purchase product:', error);
    return { items: [], totalCount: 0 };
  }
};

export const AddPurchaseProduct = async (payload) => {
  try {
    const response = await axiosInstance.post('/PurchaseProduct/AddPurchaseProduct', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating purchase product:', error);
    return { success: false, message: 'Failed to create purchase product' };
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