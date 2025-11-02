import axiosInstance from './axios';

// Revenue APIs
export const GetDailyRevenue = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDailyRevenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    throw error;
  }
};

export const GetWeeklyRevenue = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeeklyRevenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    throw error;
  }
};

export const GetMonthlyRevenue = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetMonthlyRevenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};

export const GetYearlyRevenue = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearlyRevenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly revenue:', error);
    throw error;
  }
};

// Sales Data APIs
export const GetDailySalesData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDailySalesData');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily sales data:', error);
    throw error;
  }
};

export const GetWeeklySalesData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeeklySalesData');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly sales data:', error);
    throw error;
  }
};

export const GetYearlySalesData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearlySalesData');
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly sales data:', error);
    throw error;
  }
};

// Total Sales APIs
export const GetTotalDailySale = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetTotalDailySale');
    return response.data;
  } catch (error) {
    console.error('Error fetching total daily sale:', error);
    throw error;
  }
};

export const GetTotalWeeklySale = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetTotalWeeklySale');
    return response.data;
  } catch (error) {
    console.error('Error fetching total weekly sale:', error);
    throw error;
  }
};

export const GetTotalMonthlySale = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetTotalMonthlySale');
    return response.data;
  } catch (error) {
    console.error('Error fetching total monthly sale:', error);
    throw error;
  }
};

export const GetTotalYearlySale = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetTotalYearlySale');
    return response.data;
  } catch (error) {
    console.error('Error fetching total yearly sale:', error);
    throw error;
  }
};

// Sales APIs
export const GetDailySales = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDailySales');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    throw error;
  }
};

export const GetWeeklySales = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeeklySales');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    throw error;
  }
};

export const GetYearlySales = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearlySales');
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly sales:', error);
    throw error;
  }
};

// Profit APIs
export const GetDayProfit = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDayProfit');
    return response.data;
  } catch (error) {
    console.error('Error fetching day profit:', error);
    throw error;
  }
};

export const GetWeeklyProfit = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeeklyProfit');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly profit:', error);
    throw error;
  }
};

export const GetMonthProfit = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetMonthProfit');
    return response.data;
  } catch (error) {
    console.error('Error fetching month profit:', error);
    throw error;
  }
};

export const GetYearProfit = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearProfit');
    return response.data;
  } catch (error) {
    console.error('Error fetching year profit:', error);
    throw error;
  }
};

// Profit Data APIs
export const GetDailyProfitData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDailyProfitData');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily profit data:', error);
    throw error;
  }
};

export const GetWeeklyProfitData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeeklyProfitData');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly profit data:', error);
    throw error;
  }
};

export const GetYearlyProfitData = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearlyProfitData');
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly profit data:', error);
    throw error;
  }
};

// Profit Comparison APIs
export const GetDayProfitComparison = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetDayProfitComparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching day profit comparison:', error);
    throw error;
  }
};

export const GetWeekProfitComparison = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetWeekProfitComparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching week profit comparison:', error);
    throw error;
  }
};

export const GetYearProfitComparison = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/GetYearProfitComparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching year profit comparison:', error);
    throw error;
  }
};
