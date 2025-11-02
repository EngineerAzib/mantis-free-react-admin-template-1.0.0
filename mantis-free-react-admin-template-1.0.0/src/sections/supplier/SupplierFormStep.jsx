import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Box } from '@mui/material';

const SupplierFormStep = ({ formData = {}, handleInputChange }) => {
  // Debug logs
  console.log('Current formData:', formData);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Supplier Name"
        value={formData.SupplierName || ''}
        onChange={handleInputChange('supplier', 'SupplierName')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Address"
        value={formData.Address || ''}
        onChange={handleInputChange('supplier', 'Address')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={formData.PhoneNumber || ''}
        onChange={handleInputChange('supplier', 'PhoneNumber')}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.Email || ''}
        onChange={handleInputChange('supplier', 'Email')}
        required
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

// Prop validation
SupplierFormStep.propTypes = {
  formData: PropTypes.shape({
    SupplierName: PropTypes.string,
    Address: PropTypes.string,
    PhoneNumber: PropTypes.string,
    Email: PropTypes.string,
  }),
  handleInputChange: PropTypes.func.isRequired,
};

SupplierFormStep.defaultProps = {
  formData: {},
};

export default SupplierFormStep;