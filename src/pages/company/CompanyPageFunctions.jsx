import { useQueryClient } from '@tanstack/react-query';
import { GetCompany, GetStore,AddStore, GetUsers, CompanyStoreUser, AddUser, GetAuthorizedPersonInfo } from '../../api/CompanyStoreUser';
import { Box, Typography } from '@mui/material';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

// Fetch initial data
export const initialCompaniesData = async (pageNumber = 1, pageSize = 10, searchText = '') => {
  try {
    console.log('🔍 Fetching companies with params:', { pageNumber, pageSize, searchText });
    const filter = searchText;
    const response = await GetCompany(pageNumber, pageSize, filter);
    console.log('✅ Fetched companies response:', response);
    console.log('📊 Companies data structure:', {
      hasItems: !!response.items,
      itemsLength: response.items?.length,
      totalCount: response.totalCount,
      responseKeys: Object.keys(response || {})
    });
    return {
      items: Array.isArray(response.items) ? response.items : [],
      totalCount: response.totalCount || 0,
    };
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    return { items: [], totalCount: 0 };
  }
};

export const initialStoresData = async (pageNumber = 1, pageSize = 10, searchText = '') => {
  try {
    debugger
    const filter = searchText;
    const response = await GetStore(pageNumber, pageSize, filter);
    console.log('Fetched stores:', response);
    return {
      items: Array.isArray(response.items) ? response.items : [],
      totalCount: response.totalCount || 0,
    };
  } catch (error) {
    console.error('Error fetching stores:', error);
    return { items: [], totalCount: 0 };
  }
};

export const initialUsersData = async (pageNumber = 1, pageSize = 10, searchText = '') => {
  try {
  
    const filter = searchText ;
    const response = await GetUsers(pageNumber, pageSize, filter);
    console.log('Fetched users:', response);
    return {
      items: Array.isArray(response.items) ? response.items : [],
      totalCount: response.totalCount || 0,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { items: [], totalCount: 0 };
  }
};

// Fetch authorized person info
export const initialAuthorizedPersonInfo = async () => {
  try {
    console.log('Fetching authorized person info...');
    const response = await GetAuthorizedPersonInfo();
    console.log('Authorized person info:', response);
    return response;
  } catch (error) {
    console.error('Error fetching authorized person info:', error);
    // Return default tabs if API fails
    return {
      role: 'Admin',
      tabs: [
        { tabName: 'Company' },
        { tabName: 'Store' },
        { tabName: 'User' }
      ]
    };
  }
};

// Get table columns based on activeTab
export const getTableColumns = (activeTab) => {
  switch (activeTab) {
    case 'companies':
      return [
        { header: 'Company Name', accessor: 'name' },
        {
          header: 'Contact',
          accessor: 'companyEmail',
          render: (value, item) => (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                <Mail size={14} color="grey.500" />
                {value}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Phone size={14} color="grey.500" />
                {item.phoneNumber}
              </Box>
            </Box>
          ),
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (value) => (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 'medium',
                borderRadius: '999px',
                bgcolor: value === 'Active' ? 'success.light' : 'error.light',
                color: value === 'Active' ? 'success.dark' : 'error.dark',
                display: 'inline-block',
              }}
            >
              {value}
            </Box>
          ),
        },
      ];
    case 'stores':
     // console.log('Stores data:', storesData);
      return [
        { header: 'Store Name', accessor: 'storeName' },
        { header: 'Company', accessor: 'companyName' },
        {
          header: 'Location',
          accessor: 'address',
          render: (value) => (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, fontSize: '0.875rem' }}>
              <MapPin size={14} color="grey.500" sx={{ mt: 0.25 }} />
              <Typography sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</Typography>
            </Box>
          ),
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
     
        {
          header: 'Status',
          accessor: 'isActive',
          render: (value) => (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 'medium',
                borderRadius: '999px',
                bgcolor: value === true ? 'success.light' : 'error.light',
                color: value === false ? 'success.dark' : 'error.dark',
                display: 'inline-block',
              }}
            >
              {value}
            </Box>
          ),
        },
      ];
    case 'users':
      return [
        { header: 'Name', accessor: 'fullName' },
        {header:'User Name', accessor: 'userName'},
        {
          header: 'Email',
          accessor: 'email',
          render: (value) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
              <Mail size={14} color="grey.500" />
              {value}
            </Box>
          ),
        },
        { header: 'Phone', accessor: 'phoneNumber' },
        { header: 'Role', accessor: 'role' },
        { header: 'Company', accessor: 'companyName' },
        { header: 'Store', accessor: 'storeName' },
      
        {
          header: 'Status',
          accessor: 'isActive',
          render: (value) => (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 'medium',
                borderRadius: '999px',
                bgcolor: value === 'true' ? 'success.light' : 'error.light',
                color: value === 'false' ? 'success.dark' : 'error.dark',
                display: 'inline-block',
              }}
            >
              {value}
            </Box>
          ),
        },
      ];
    default:
      return [];
  }
};

// Form handlers
export const handleInputChange = (setFormData) => (entity, field) => (event) => {
  debugger
  console.log(`handleInputChange for ${entity}.${field}`, event.target.value);
  
  setFormData((prev) => ({
    ...prev,
    [entity]: { ...prev[entity], [field]: event.target.value },
  }));
};

export const handleCheckboxChange = (setFormData) => (entity, field) => (event) => {
  console.log(`handleCheckboxChange for ${entity}.${field}`, event.target.checked);
  setFormData((prev) => ({
    ...prev,
    [entity]: { ...prev[entity], [field]: event.target.checked },
  }));
};

export const handleClose = (setModalState, setFormData, initialData) => (entity) => {
  console.log(`Closing ${entity} modal`);
  setModalState({ type: null, open: false, activeStep: 0 });
  setFormData({
    company: {
      name: '',
      ntn: '',
      companyEmail: '',
      phoneNumber: '',
      foundedDate: '',
      storeName: '',
      storeCode: '',
      storeEmail: '',
      storePhone: '',
      isMainBranch: false,
      address: '',
      fullName: '',
      userAddress: '',
      cnic: '',
      gender: '',
      userName: '',
      userEmail: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    store: { name: '', companyId: '', address: '', type: '', manager: '', employees: '' },
    user: { name: '', email: '', role: '', companyId: '', storeId: '', joinDate: '' },
    ...initialData,
  });
};

export const handleNext = (setModalState) => (entity) => {
  console.log(`Next step for ${entity}`);
  setModalState((prev) => ({ ...prev, activeStep: prev.activeStep + 1 }));
};

export const handleBack = (setModalState) => (entity) => {
  console.log(`Back step for ${entity}`);
  setModalState((prev) => ({ ...prev, activeStep: prev.activeStep - 1 }));
};

export const handleCompanySubmit = async (formData, queryClient, setMessage, handleClose) => {
  const {
    name,
    companyEmail,
    phoneNumber,
    foundedDate,
    storeName,
    storeCode,
    storeEmail,
    storePhone,
    isMainBranch,
    address,
    fullName,
    userAddress,
    cnic,
    gender,
    userName,
    userEmail,
    password,
    confirmPassword,
    role,
    ntn,
  } = formData.company;

  if (password !== confirmPassword) {
    setMessage({ open: true, message: 'Passwords do not match!', severity: 'error' });
    return;
  }

  if (!name || !storeName || !fullName || !password || !confirmPassword || !role) {
    setMessage({ open: true, message: 'Required fields are missing!', severity: 'error' });
    return;
  }

  const companyPayload = {
    Name: name,
    CompanyEmail: companyEmail,
    PhoneNumber: phoneNumber,
    FoundedDate: foundedDate ? new Date(foundedDate).toISOString().split('T')[0] : null,
    StoreName: storeName,
    StoreCode: storeCode,
    StoreEmail: storeEmail,
    StorePhone: storePhone,
    IsMainBranch: isMainBranch,
    Address: address,
    FullName: fullName,
    UserAddress: userAddress,
    Cnic: cnic,
    Gender: gender,
    UserName: userName,
    UserEmail: userEmail,
    Password: password,
    ConfirmPassword: confirmPassword,
    Role: role,
    Ntn: ntn,
  };

  try {
    const result = await CompanyStoreUser(companyPayload);
    queryClient.setQueryData(['companies', 1, 10, ''], (old = { items: [], totalCount: 0 }) => ({
      items: [...old.items, result],
      totalCount: old.totalCount + 1,
    }));
    console.log('Payload sent to API:', companyPayload);
    setMessage({ open: true, message: 'Company added successfully!', severity: 'success' });
    handleClose('company');
  } catch (error) {
    console.error('Error adding company:', error);
    setMessage({ open: true, message: 'Failed to add company. Please try again.', severity: 'error' });
  }
};

export const handleStoreSubmit = async (formData, companiesData, storesData, onSubmit, queryClient, setMessage, handleClose) => {
  
  const { StoreName, companyId, StoreCode, Email, Phone, IsMainBranch, Address } = formData.store;
  
  if (!StoreName || !companyId) {
    setMessage({ open: true, message: 'Store name and company are required!', severity: 'error' });
    return;
  }

  const company = companiesData.find((c) => c.id === parseInt(companyId));
  
  try {
    const newStore = {
      StoreName,
      StoreCode: StoreCode || null,
      Email: Email || null,
      Phone: Phone || null,
      IsMainBranch: IsMainBranch || false,
      Address: Address || null,
      companyId: parseInt(companyId),
    };

    // If you're making an API call:
     const response = await AddStore(newStore);
     console.log('Store creation response:', response);
    // Update local cache
    queryClient.setQueryData(['stores', 1, 10, ''], (old = { items: [], totalCount: 0 }) => ({
      items: [...old.items, newStore],
      totalCount: old.totalCount + 1,
    }));

    onSubmit(newStore);
    setMessage({ open: true, message: 'Store added successfully!', severity: 'success' });
    handleClose('store');
  } catch (error) {
    console.error('Error adding store:', error);
    setMessage({ open: true, message: 'Failed to add store. Please try again.', severity: 'error' });
  }
};

export const handleUserSubmit = async (formData, companiesData, storesData, onSubmit, queryClient, setMessage, handleClose) => {
  const { username, email, fullName, address, cnic, phoneNumber, gender, role, companyId, storeId, password, confirmPassword, joinDate } = formData.user;
  
  // Clean and validate role - ensure it's a string
  let cleanRole = '';
  if (role) {
    if (typeof role === 'string') {
      // Remove any invalid characters and trim
      cleanRole = role.replace(/[^\x20-\x7E]/g, '').trim();
    } else if (typeof role === 'object' && role !== null) {
      // If role is an object, extract the name property
      cleanRole = (role.name || role.roleName || String(role)).replace(/[^\x20-\x7E]/g, '').trim();
    } else {
      cleanRole = String(role).replace(/[^\x20-\x7E]/g, '').trim();
    }
  }
  
  // Validation
  if (!username || !email || !fullName || !cleanRole || !password || !confirmPassword) {
    setMessage({ open: true, message: 'Username, email, full name, role, and passwords are required!', severity: 'error' });
    return;
  }
  
  if (password !== confirmPassword) {
    setMessage({ open: true, message: 'Passwords do not match!', severity: 'error' });
    return;
  }

  try {
    // Prepare user data for API - ensure all string fields are properly cleaned
    const userData = {
      Username: String(username).trim(),
      Email: String(email).trim(),
      FullName: String(fullName).trim(),
      Address: address ? String(address).trim() : '',
      CNIC: cnic ? String(cnic).trim() : '',
      PhoneNumber: phoneNumber ? String(phoneNumber).trim() : '',
      Gender: gender ? String(gender).trim() : '',
      CompanyId: companyId ? parseInt(companyId) : null,
      StoreId: storeId ? parseInt(storeId) : null,
      Password: String(password),
      ConfirmPassword: String(confirmPassword),
      Role: cleanRole
    };
    
    // Log the cleaned data for debugging
    console.log('Cleaned user data being sent:', userData);

    // Call the AddUser API
    const response = await AddUser(userData);
    console.log('User creation response:', response);
    
    // Update local cache with the new user
    const company = companiesData.find((c) => 
      String(c.id) === String(companyId) || String(c.companyId) === String(companyId)
    );
    const store = storesData.find((s) => String(s.id) === String(storeId));
    
    const newUser = {
      id: Date.now(), // Temporary ID
      username,
      email,
      fullName,
      role,
      companyId: parseInt(companyId) || null,
      companyName: company?.name || 'Unknown',
      storeId: parseInt(storeId) || null,
      storeName: store?.name || 'None',
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    
    queryClient.setQueryData(['users', 1, 10, ''], (old = { items: [], totalCount: 0 }) => ({
      items: [...old.items, newUser],
      totalCount: old.totalCount + 1,
    }));
    
    onSubmit(formData.user);
    setMessage({ open: true, message: 'User added successfully!', severity: 'success' });
    handleClose('user');
    
  } catch (error) {
    console.error('User registration error:', error);
    setMessage({ 
      open: true, 
      message: error.message || 'Failed to add user. Please try again.', 
      severity: 'error' 
    });
  }
};

export const handleOpenModal = (setModalState) => (type) => {
  console.log(`Opening ${type} modal`);
  setModalState({ type, open: true, activeStep: 0 });
};