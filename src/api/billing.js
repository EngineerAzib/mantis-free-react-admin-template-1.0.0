// api/billing.js
import axiosInstance from "./axios";

export const AddBilling = async (payload) => {
    debugger;
    try {
      const response = await axiosInstance.post('/Billing/AddBilling', payload);
      console.log("✅ Billing created successfully:", response.data);
      const data = response.data.data;
      debugger;
      if (data.receiptHtml) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(data.receiptHtml);
        printWindow.document.close();
        printWindow.print(); // ✅ Print dialog khud open ho jayega
      }
      return response.data; // { id, invoiceNo, ... }
    } catch (error) {
      // Log full error object
      console.error("❌ Error creating billing:", error);
  
      // Agar backend ka response mila hai
      if (error.response) {
        console.error("🔴 Backend error response:", error.response.data);
        console.error("🔴 Status code:", error.response.status);
        console.error("🔴 Headers:", error.response.headers);
      } 
      // Agar request gaya lekin response hi nahi aaya
      else if (error.request) {
        console.error("🟠 No response received:", error.request);
      } 
      // Agar request banate hi issue aa gaya
      else {
        console.error("⚠️ Error setting up request:", error.message);
      }
  
      throw error;
    }
  };
  


export const GetCategory = async (pageNumber = 1, pageSize = 1000) => {
  try {
    const response = await axiosInstance.get('/Catagory/GetCategory', {
      params: { pageNumber, pageSize },
    });
    return response.data; // { items: [{ categoryId, name, ... }], totalCount }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { items: [], totalCount: 0 };
  }
};
// api/product.js


export const GetSearchAllProduct = async (pageNumber = 1, pageSize = 10, categoryId = null, searchTerm = null) => {
  try {
    const params = { pageNumber, pageSize };
    if (categoryId && categoryId !== 'All') {
      params.categoryId = categoryId;
    }
    if (searchTerm) {
      params.filter = searchTerm;
    }
    const response = await axiosInstance.get('/Product/GetSearchAllProduct', { params });
    return response.data; // { items: [{ productId, name, salePrice, quantityInStock, categoryName, categoryId, discount, unit }], totalCount }
  } catch (error) {
    console.error('Error fetching products:', error);
    return { items: [], totalCount: 0 };
  }
};