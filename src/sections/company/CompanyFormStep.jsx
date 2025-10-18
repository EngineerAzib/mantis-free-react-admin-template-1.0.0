import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { getRoles } from '../../api/auth';

const CompanyFormStep = ({ activeStep, formData, handleInputChange, handleCheckboxChange, companiesData }) => {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  console.log('CompanyFormStep: Rendering with activeStep:', activeStep, 'formData:', formData);
  console.log('CompanyFormStep: handleInputChange:', handleInputChange, 'handleCheckboxChange:', handleCheckboxChange);

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
      {activeStep === 0 && (
        <>
          <TextField
            fullWidth
            label="Company Name"
            value={formData.name || ''}
            onChange={handleInputChange('company', 'name')}
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
            label="NTN"
            value={formData.ntn || ''}
            onChange={handleInputChange('company', 'ntn')}
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
            value={formData.companyEmail || ''}
            onChange={handleInputChange('company', 'companyEmail')}
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
            onChange={handleInputChange('company', 'phoneNumber')}
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
            label="Founded Date"
            type="date"
            value={formData.foundedDate || ''}
            onChange={handleInputChange('company', 'foundedDate')}
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
        </>
      )}
      {activeStep === 1 && (
        <>
          <TextField
            fullWidth
            label="Store Name"
            value={formData.storeName || ''}
            onChange={handleInputChange('company', 'storeName')}
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
            label="Store Code"
            value={formData.storeCode || ''}
            onChange={handleInputChange('company', 'storeCode')}
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
            label="Store Email"
            type="email"
            value={formData.storeEmail || ''}
            onChange={handleInputChange('company', 'storeEmail')}
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
            label="Store Phone"
            value={formData.storePhone || ''}
            onChange={handleInputChange('company', 'storePhone')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isMainBranch || false}
                onChange={handleCheckboxChange('company', 'isMainBranch')}
                sx={{ color: 'grey.300', '&.Mui-checked': { color: 'primary.main' } }}
              />
            }
            label="Main Branch"
            sx={{ color: 'grey.700' }}
          />
          <TextField
            fullWidth
            label="Address"
            value={formData.address || ''}
            onChange={handleInputChange('company', 'address')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        </>
      )}
      {activeStep === 2 && (
        <>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName || ''}
            onChange={handleInputChange('company', 'fullName')}
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
            label="User Address"
            value={formData.userAddress || ''}
            onChange={handleInputChange('company', 'userAddress')}
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
            onChange={handleInputChange('company', 'cnic')}
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
            onChange={handleInputChange('company', 'gender')}
            displayEmpty
            renderValue={(value) => (value ? value : 'Select Gender')}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            }}
          >
            <MenuItem value="" disabled>
              Select Gender
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Username"
            value={formData.userName || ''}
            onChange={handleInputChange('company', 'userName')}
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
            label="User Email"
            type="email"
            value={formData.userEmail || ''}
            onChange={handleInputChange('company', 'userEmail')}
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
            label="Password"
            type="password"
            value={formData.password || ''}
            onChange={handleInputChange('company', 'password')}
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
            onChange={handleInputChange('company', 'confirmPassword')}
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
            value={formData.role || ''}
            onChange={handleInputChange('company', 'role')}
            displayEmpty
            required
            disabled={rolesLoading}
            renderValue={(selected) => {
              if (!selected) return 'Select Role';
              const role = roles.find(r => 
                String(r.id) === String(selected) || String(r.name) === String(selected)
              );
              return role?.name || role || selected;
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            }}
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
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
        </>
      )}
    </Box>
  );
};

export default CompanyFormStep;