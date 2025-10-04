// UserFormStep.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const UserFormStep = ({ 
  formData = {}, 
  handleInputChange, 
  companiesData = [], 
  storesData = [] 
}) => {
  // Extract values safely
  const companyId = formData.companyId || '';
  const storeId = formData.storeId || '';

  // Debug logs
  console.log('UserFormStep: formData:', formData);
  console.log('UserFormStep: companiesData:', companiesData);
  console.log('UserFormStep: storesData:', storesData);
  console.log('UserFormStep: selected companyId:', companyId);
  console.log('UserFormStep: selected storeId:', storeId);

  // Filter stores by selected company
  const filteredStores = storesData.filter(store => 
    String(store.companyId) === String(companyId)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.name || ''}
        onChange={handleInputChange('user', 'name')}
        required
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={handleInputChange('user', 'email')}
        required
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Role"
        value={formData.role || ''}
        onChange={handleInputChange('user', 'role')}
        required
        sx={fieldStyles}
      />
      
      <Select
        fullWidth
        value={companyId}
        onChange={handleInputChange('user', 'companyId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Company';
          const company = companiesData.find(c => 
            String(c.companyId) === String(selected)  // Use companyId from your data structure
          );
          console.log('UserFormStep: renderValue company selected:', selected, 'Found:', company);
          return company?.name || `Selected Company (ID: ${selected})`;
        }}
        required
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Company</MenuItem>
        {companiesData.map((company) => (
          <MenuItem key={company.companyId} value={company.companyId}>  {/* Use companyId */}
            {company.name}
          </MenuItem>
        ))}
      </Select>
      
      <Select
        fullWidth
        value={storeId}
        onChange={handleInputChange('user', 'storeId')}
        displayEmpty
        disabled={!companyId}
        renderValue={(selected) => {
          if (!selected) return 'Select Store';
          const store = filteredStores.find(s => 
            String(s.id) === String(selected)
          );
          console.log('UserFormStep: renderValue store selected:', selected, 'Found:', store);
          return store?.name || `Selected Store (ID: ${selected})`;
        }}
        required
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Store</MenuItem>
        {filteredStores.map((store) => (
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
        sx={fieldStyles}
      />
    </Box>
  );
};

// Style objects (shared with other form steps)
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
UserFormStep.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    storeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    joinDate: PropTypes.string
  }),
  handleInputChange: PropTypes.func.isRequired,
  companiesData: PropTypes.arrayOf(
    PropTypes.shape({
      companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  storesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  )
};

UserFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: []
};

export default UserFormStep;