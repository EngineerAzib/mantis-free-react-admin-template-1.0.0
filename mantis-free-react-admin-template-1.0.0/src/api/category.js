import axiosInstance from "./axios";

// api.jsx (dummy APIs for companies, stores, and category creation)
export const getCompanies = async () => {
  try { 
  // Dummy data for companies
  debugger
  const response=await axiosInstance.get('/Company/GetAllCompanies');
  return response.data;
  }
  catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getStoresByCompany = async (companyId) => {
  // Dummy data for stores based on companyId
  try {
    const response = await axiosInstance.get('/Store/GetAllStores', { params: { companyId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};

export const AddCategory = async (payload) => {
try{
  debugger
  const response=await axiosInstance.post('/Category/AddCategory',payload);
  return response.data;
}
catch(error){ 
  // Simulate success response
  console.error('Error creating category:', error);
  return { success: false, message: 'Failed to create category' };
}
  
};

export const UpdateCategory = async (payload) => {
  try {
    const response = await axiosInstance.put('/Category/UpdateCategory', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, message: 'Failed to update category' };
  }
};

export const DeleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/Category/DeleteCategory`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'Failed to delete category' };
  }
};

export const GetCategory = async (pageNumber = 1, pageSize = 10, filter = null) => {
  try {
    const response = await axiosInstance.get('/Category/GetCategory', {
      params: {
        pageNumber,
        pageSize,
        filter: filter ?? null,  // Ensure filter is a string if provided
      },
    });
    return response.data; // { items, pageNumber, pageSize, totalCount }
  } catch (error) {
    console.error(`Error fetching category:`, error);
    return { items: [], totalCount: 0 };
  }
};