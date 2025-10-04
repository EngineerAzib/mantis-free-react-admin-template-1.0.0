import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const ProductFormStep = ({ 
  formData = {}, 
  handleInputChange, 
  companiesData = [], 
  storesData = [], 
  categoriesData = [] 
}) => {
  // Debug logs
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Available stores:', storesData);
  console.log('Available categories:', categoriesData);
  console.log('Selected company:', 
    companiesData.find(c => c.id.toString() === formData.CompanyId?.toString())
  );
  console.log('Selected store:', 
    storesData.find(s => s.id.toString() === formData.StoreId?.toString())
  );
  console.log('Selected category:', 
    categoriesData.find(c => c.id.toString() === formData.CategoryId?.toString())
  );

  const companyId = formData.CompanyId || '';
  const storeId = formData.StoreId || '';
  const categoryId = formData.CategoryId || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.Name || ''}
        onChange={handleInputChange('product', 'Name')}
        required
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Description"
        value={formData.Description || ''}
        onChange={handleInputChange('product', 'Description')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Purchase Price"
        type="number"
        value={formData.PurchasePrice || ''}
        onChange={handleInputChange('product', 'PurchasePrice')}
        required
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Sale Price"
        type="number"
        value={formData.SalePrice || ''}
        onChange={handleInputChange('product', 'SalePrice')}
        required
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Quantity in Stock"
        type="number"
        value={formData.QuantityInStock || ''}
        onChange={handleInputChange('product', 'QuantityInStock')}
        required
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      
     
      
      <Select
        fullWidth
        value={companyId}
        onChange={handleInputChange('product', 'CompanyId')}
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
      
      <Select
        fullWidth
        value={storeId}
        onChange={handleInputChange('product', 'StoreId')}
        displayEmpty
        disabled={!companyId}
        renderValue={(selected) => {
          if (!selected) return 'Select Store';
          const store = storesData.find(s => 
            String(s.id) === String(selected)
          );
          return store?.name || 'Selected Store';
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Store</MenuItem>
        {storesData.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.name}
          </MenuItem>
        ))}
      </Select>
       <Select
        fullWidth
        value={categoryId}
        onChange={handleInputChange('product', 'CategoryId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return 'Select Category';
          const category = categoriesData.find(c => 
            String(c.id) === String(selected)
          );
          return category?.name || 'Selected Category';
        }}
        sx={selectStyles}
      >
        <MenuItem value="" disabled>Select Category</MenuItem>
        {categoriesData.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        fullWidth
        label="Remaining Quantity"
        type="number"
        value={formData.RemainingQuantity || ''}
        onChange={handleInputChange('product', 'RemainingQuantity')}
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Total Sold Quantity"
        type="number"
        value={formData.TotalSoldQuantity || ''}
        onChange={handleInputChange('product', 'TotalSoldQuantity')}
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Returned Quantity"
        type="number"
        value={formData.ReturnedQuantity || ''}
        onChange={handleInputChange('product', 'ReturnedQuantity')}
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      
      <TextField
        fullWidth
        label="Unit"
        value={formData.Unit || ''}
        onChange={handleInputChange('product', 'Unit')}
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

const selectStyles = {
  ...fieldStyles,
  textAlign: 'left'
};

// Prop validation
ProductFormStep.propTypes = {
  formData: PropTypes.shape({
    Name: PropTypes.string,
    Description: PropTypes.string,
    PurchasePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    SalePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    QuantityInStock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    StoreId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    RemainingQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TotalSoldQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ReturnedQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Unit: PropTypes.string,
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
  categoriesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),
};

ProductFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: [],
  categoriesData: [],
};

export default ProductFormStep;