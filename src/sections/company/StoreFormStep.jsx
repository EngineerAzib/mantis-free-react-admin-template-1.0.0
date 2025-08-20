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
  // Debug logs
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Selected company:', 
    companiesData.find(c => c.id.toString() === formData.companyId?.toString())
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
        onChange={handleInputChange('store', 'companyId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Company';
          const company = companiesData.find(c => 
            String(c.id) === String(selected)
          );
          return company?.name || 'Selected Company';
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Company</MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.id} value={company.id}>
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  )
};

StoreFormStep.defaultProps = {
  formData: {},
  companiesData: []
};

export default StoreFormStep;