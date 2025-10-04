// StoreFormStep.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box, FormControlLabel, Checkbox } from '@mui/material';

const StoreFormStep = ({ 
  formData = {}, 
  handleInputChange, 
  handleCheckboxChange, 
  companiesData = [] 
}) => {
  // Extract companyId safely to avoid undefined errors
  const companyId = formData.companyId || '';

  // Debug logs with safe access to avoid toString on undefined
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Selected companyId:', companyId, 'Type:', typeof companyId);
  console.log('Selected company:', 
    companiesData.find(c => String(c.companyId) === String(companyId))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Store Name"
        value={formData.StoreName || ''}
        onChange={handleInputChange('store', 'StoreName')}
        required
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Store Code"
        value={formData.StoreCode || ''}
        onChange={handleInputChange('store', 'StoreCode')}
        sx={fieldStyles}
      />
      
      <Select
        fullWidth
        value={companyId}
        onChange={(event) => {
          const selectedValue = event.target.value;
          console.log('Select onChange - selectedValue:', selectedValue, 'Type:', typeof selectedValue);
          console.log('companiesData:', companiesData);
          handleInputChange('store', 'companyId')(event);
        }}
        displayEmpty
        renderValue={(selected) => {
          console.log('renderValue called with selected:', selected, 'Type:', typeof selected);
          if (!selected) {
            console.log('No selected value, returning "Select Company"');
            return 'Select Company';
          }
          console.log('companiesData:', companiesData);
          console.log('selected:', selected);
          console.log('companiesData.find(c => String(c.companyId) === String(selected)):', companiesData.find(c => String(c.companyId) === String(selected)));
          const company = companiesData.find(c => 
            String(c.companyId) === String(selected)
          );
          console.log('Found company:', company);
          if (company) {
            return company.name;
          } else {
            console.warn('No company found for selected ID:', selected, 'Available companyIds:', companiesData.map(c => ({ companyId: c.companyId, type: typeof c.companyId })));
            return `Selected Company (ID: ${selected})`;
          }
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Company</MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.companyId} value={company.companyId}>
            {company.name}
          </MenuItem>
        ))}
      </Select>

      <TextField
        fullWidth
        label="Email"
        value={formData.Email || ''}
        onChange={handleInputChange('store', 'Email')}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Phone"
        value={formData.Phone || ''}
        onChange={handleInputChange('store', 'Phone')}
        sx={fieldStyles}
      />
      
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.IsMainBranch || false}
            onChange={handleCheckboxChange('store', 'IsMainBranch')}
            color="primary"
          />
        }
        label="Is Main Branch"
      />
      
      <TextField
        fullWidth
        label="Address"
        value={formData.Address || ''}
        onChange={handleInputChange('store', 'Address')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
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
StoreFormStep.propTypes = {
  formData: PropTypes.shape({
    StoreName: PropTypes.string,
    StoreCode: PropTypes.string,
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Email: PropTypes.string,
    Phone: PropTypes.string,
    IsMainBranch: PropTypes.bool,
    Address: PropTypes.string
  }),
  handleInputChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  companiesData: PropTypes.arrayOf(
    PropTypes.shape({
      companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  )
};

StoreFormStep.defaultProps = {
  formData: {},
  companiesData: []
};

export default StoreFormStep;