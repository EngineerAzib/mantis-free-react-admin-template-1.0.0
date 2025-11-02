import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const StaffFormStep = ({
  formData = {},
  handleInputChange,
  companiesData = [],
  storesData = [],
}) => {
  // Debug logs
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Available stores:', storesData);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.Name || ''}
        onChange={handleInputChange('staff', 'Name')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Phone"
        value={formData.Phone || ''}
        onChange={handleInputChange('staff', 'Phone')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Role"
        value={formData.Role || ''}
        onChange={handleInputChange('staff', 'Role')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="NIC Number"
        value={formData.NIC_number || ''}
        onChange={handleInputChange('staff', 'NIC_number')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Address"
        value={formData.Address || ''}
        onChange={handleInputChange('staff', 'Address')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Salary"
        type="number"
        value={formData.Salary || ''}
        onChange={handleInputChange('staff', 'Salary')}
        inputProps={{ step: '0.01', min: '0' }}
        required
        sx={fieldStyles}
      />
      <Select
        fullWidth
        value={formData.CompanyId || ''}
        onChange={handleInputChange('staff', 'CompanyId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Company';
          const company = companiesData.find(c => String(c.id) === String(selected));
          return company?.name || 'Selected Company';
        }}
        required
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Company</MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        fullWidth
        value={formData.StoreId || ''}
        onChange={handleInputChange('staff', 'StoreId')}
        displayEmpty
        disabled={!formData.CompanyId}
        renderValue={(selected) => {
          if (!selected) return 'Select Store';
          const store = storesData.find(s => String(s.id) === String(selected));
          return store?.name || 'Selected Store';
        }}
        required
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Store</MenuItem>
        {storesData.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.name}
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
StaffFormStep.propTypes = {
  formData: PropTypes.shape({
    Name: PropTypes.string,
    Phone: PropTypes.string,
    Role: PropTypes.string,
    NIC_number: PropTypes.string,
    Address: PropTypes.string,
    Salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    StoreId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleInputChange: PropTypes.func.isRequired,
  companiesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  storesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),
};

StaffFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: [],
};

export default StaffFormStep;