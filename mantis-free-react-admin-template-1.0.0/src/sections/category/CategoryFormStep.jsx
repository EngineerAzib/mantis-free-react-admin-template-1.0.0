import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const CategoryFormStep = ({ 
  formData = {}, 
  handleInputChange, 
  companiesData = [], 
  storesData = [] 
}) => {
  // Debug logs
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Available stores:', storesData);
  console.log('Selected company:', 
    companiesData.find(c => c.companyId.toString() === formData.CompanyId?.toString())
  );
  console.log('Selected store:', 
    storesData.find(s => s.storeId.toString() === formData.StoreId?.toString())
  );

  const companyId = formData.CompanyId || '';
  const storeId = formData.StoreId || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.Name || ''}
        onChange={handleInputChange('category', 'Name')}
        required
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Description"
        value={formData.Description || ''}
        onChange={handleInputChange('category', 'Description')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
      
      <Select
        fullWidth
        value={companyId}
        onChange={handleInputChange('category', 'CompanyId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Company';
          const company = companiesData.find(c => 
            String(c.companyId) === String(selected)
          );
          return company?.companyName || 'Selected Company';
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Company</MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.companyId} value={company.companyId}>
            {company.companyName}
          </MenuItem>
        ))}
      </Select>
      
      <Select
        fullWidth
        value={storeId}
        onChange={handleInputChange('category', 'StoreId')}
        displayEmpty
        disabled={!companyId}
        renderValue={(selected) => {
          if (!selected) return 'Select Store';
          const store = storesData.find(s => 
            String(s.storeId) === String(selected)
          );
          return store?.storeName || 'Selected Store';
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Store</MenuItem>
        {storesData.map((store) => (
          <MenuItem key={store.storeId} value={store.storeId}>
            {store.storeName}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

// Style objects
const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    '& fieldset': { borderColor: 'grey.300' },
    '&:hover fieldset': { borderColor: 'grey.500' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  }
};

const selectStyles = {
  ...fieldStyles,
  textAlign: 'left'
};

// Prop validation
CategoryFormStep.propTypes = {
  formData: PropTypes.shape({
    Name: PropTypes.string,
    Description: PropTypes.string,
    CompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    StoreId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleInputChange: PropTypes.func.isRequired,
  companiesData: PropTypes.arrayOf(
    PropTypes.shape({
      companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      companyName: PropTypes.string.isRequired
    })
  ),
  storesData: PropTypes.arrayOf(
    PropTypes.shape({
      storeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      storeName: PropTypes.string.isRequired
    })
  )
};

CategoryFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: []
};

export default CategoryFormStep;