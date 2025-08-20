import React from 'react';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const UserFormStep = ({ formData, handleInputChange, companiesData, storesData }) => {
  console.log('UserFormStep: Rendering with formData:', formData, 'companiesData:', companiesData, 'storesData:', storesData);
  console.log('UserFormStep: handleInputChange:', handleInputChange);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.name || ''}
        onChange={handleInputChange('user', 'name')}
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
        label="Role"
        value={formData.role || ''}
        onChange={handleInputChange('user', 'role')}
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
        onChange={handleInputChange('user', 'companyId')}
        displayEmpty
        renderValue={(value) => (value ? companiesData.find((c) => c.id === parseInt(value))?.name || 'Select Company' : 'Select Company')}
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
          <MenuItem key={company.id} value={company.id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        fullWidth
        value={formData.storeId || ''}
        onChange={handleInputChange('user', 'storeId')}
        displayEmpty
        renderValue={(value) => (value ? storesData.find((s) => s.id === parseInt(value))?.name || 'Select Store' : 'Select Store')}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        }}
      >
        <MenuItem value="" disabled>
          Select Store
        </MenuItem>
        {storesData.filter((s) => s.companyId === parseInt(formData.companyId)).map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.name}
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