import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const ExpenseFormStep = ({
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
        onChange={handleInputChange('expense', 'Name')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={formData.Amount || ''}
        onChange={handleInputChange('expense', 'Amount')}
        inputProps={{ step: '0.01', min: '0' }}
        required
        sx={fieldStyles}
      />
      <Select
        fullWidth
        value={formData.CompanyId || ''}
        onChange={handleInputChange('expense', 'CompanyId')}
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
        onChange={handleInputChange('expense', 'StoreId')}
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
      <TextField
        fullWidth
        label="Start Date"
        type="date"
        value={formData.StartDate || ''}
        onChange={handleInputChange('expense', 'StartDate')}
        InputLabelProps={{ shrink: true }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="End Date"
        type="date"
        value={formData.EndDate || ''}
        onChange={handleInputChange('expense', 'EndDate')}
        InputLabelProps={{ shrink: true }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Notes"
        value={formData.Notes || ''}
        onChange={handleInputChange('expense', 'Notes')}
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
ExpenseFormStep.propTypes = {
  formData: PropTypes.shape({
    Name: PropTypes.string,
    Amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    StoreId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    StartDate: PropTypes.string,
    EndDate: PropTypes.string,
    Notes: PropTypes.string,
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

ExpenseFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: [],
};

export default ExpenseFormStep;