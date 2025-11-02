import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { getRoles } from 'api/auth';

const UserFormStep = ({ formData, handleInputChange, companiesData, storesData }) => {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  console.log('UserFormStep: Rendering with formData:', formData, 'companiesData:', companiesData, 'storesData:', storesData);
  console.log('UserFormStep: handleInputChange:', handleInputChange);
  
  // Debug store data structure
  console.log('UserFormStep: Store data structure:', storesData.map(s => ({
    id: s.id,
    storeId: s.storeId,
    name: s.name,
    storeName: s.storeName,
    companyId: s.companyId
  })));

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Username"
        value={formData.username || ''}
        onChange={handleInputChange('user', 'username')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="Full Name"
        value={formData.fullName || ''}
        onChange={handleInputChange('user', 'fullName')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={handleInputChange('user', 'email')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="Address"
        value={formData.address || ''}
        onChange={handleInputChange('user', 'address')}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="CNIC"
        value={formData.cnic || ''}
        onChange={handleInputChange('user', 'cnic')}
        placeholder="12345-1234567-1"
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={formData.phoneNumber || ''}
        onChange={handleInputChange('user', 'phoneNumber')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <Select
        fullWidth
        value={formData.gender || ''}
        onChange={handleInputChange('user', 'gender')}
        displayEmpty
        required
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        }}
      >
        <MenuItem value="" disabled>Select Gender</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
      <Select
        fullWidth
        value={formData.role || ''}
        onChange={handleInputChange('user', 'role')}
        displayEmpty
        required
        disabled={rolesLoading}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        }}
      >
        <MenuItem value="" disabled>Select Role</MenuItem>
        {roles.map((role) => (
          <MenuItem key={role.id || role} value={role.name || role}>
            {role.name || role}
          </MenuItem>
        ))}
      </Select>
      {rolesLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password || ''}
        onChange={handleInputChange('user', 'password')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword || ''}
        onChange={handleInputChange('user', 'confirmPassword')}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <Select
        fullWidth
        value={formData.companyId || ''}
        onChange={(event) => {
          // Reset storeId when company changes
          const newCompanyId = event.target.value;
          handleInputChange('user', 'companyId')(event);
          // Clear storeId when company changes
          if (formData.storeId) {
            handleInputChange('user', 'storeId')({ target: { value: '' } });
          }
        }}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Company';
          const company = companiesData.find(c => 
            String(c.id) === String(selected) || String(c.companyId) === String(selected)
          );
          console.log('UserFormStep: renderValue company selected:', selected, 'Found:', company);
          return company?.name || `Selected Company (ID: ${selected})`;
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        }}
      >
        <MenuItem value="" disabled>
          Select Company
        </MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.id || company.companyId} value={company.id || company.companyId}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        fullWidth
        value={formData.storeId || ''}
        onChange={handleInputChange('user', 'storeId')}
        displayEmpty
        disabled={!formData.companyId}
        renderValue={(selected) => {
          if (!selected) return 'Select Store';
          const store = storesData.find(s => 
            String(s.id) === String(selected) || String(s.storeId) === String(selected)
          );
          console.log('UserFormStep: renderValue store selected:', selected, 'Found:', store);
          return store?.name || store?.storeName || `Selected Store (ID: ${selected})`;
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        }}
      >
        <MenuItem value="" disabled>
          Select Store
        </MenuItem>
        {storesData.filter((s) => 
          String(s.companyId) === String(formData.companyId)
        ).map((store) => (
          <MenuItem key={store.id || store.storeId} value={store.id || store.storeId}>
            {store.name || store.storeName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        fullWidth
        label="Join Date"
        type="date"
        value={formData.joinDate || ''}
        onChange={handleInputChange('user', 'joinDate')}
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
    </Box>
  );
};

export default UserFormStep;