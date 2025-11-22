import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Select, MenuItem, Autocomplete, Box, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { GetProduct, GetSupplier } from '../../api/purchaseProduct';

const PurchaseProductFormStep = ({
  formData = {},
  handleInputChange,
  companiesData = [],
  storesData = [],
}) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null); // New state for selected supplier
  const [productPage, setProductPage] = useState(1);
  const [supplierPage, setSupplierPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreSuppliers, setHasMoreSuppliers] = useState(true);

  const pageSize = 10;

  // Debounced search functions
  const debouncedFetchProducts = debounce(async (searchTerm, page) => {
    setProductLoading(true);
    try {
      const response = await GetProduct(page, pageSize, searchTerm || null);
      const newProducts = response.items.map(product => ({
        id: product.productId,
        name: product.name
      }));
      setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
      setHasMoreProducts(response.items.length === pageSize);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductLoading(false);
    }
  }, 300);

  const debouncedFetchSuppliers = debounce(async (searchTerm, page) => {
    setSupplierLoading(true);
    try {
      const response = await GetSupplier(page, pageSize, searchTerm || null);
      const newSuppliers = response.items.map(supplier => ({
        id: supplier.supplierId,
        name: supplier.supplierName
      }));
      // Ensure selected supplier persists in the list
      setSuppliers(prev => {
        const updatedSuppliers = page === 1 ? newSuppliers : [...prev, ...newSuppliers];
        if (selectedSupplier && !updatedSuppliers.some(s => s.id === selectedSupplier.id)) {
          return [selectedSupplier, ...updatedSuppliers];
        }
        return updatedSuppliers;
      });
      setHasMoreSuppliers(response.items.length === pageSize);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setSupplierLoading(false);
    }
  }, 300);

  // Fetch initial products and suppliers
  useEffect(() => {
    debouncedFetchProducts('', 1);
    debouncedFetchSuppliers('', 1);
    return () => {
      debouncedFetchProducts.cancel();
      debouncedFetchSuppliers.cancel();
    };
  }, []);

  // Sync selectedSupplier with formData.SupplierId  
  useEffect(() => {
    if (formData.SupplierId && !selectedSupplier) {
      // Fetch supplier details if SupplierId exists but selectedSupplier is not set
      GetSupplier(1, pageSize, null).then(response => {
        const supplier = response.items.find(s => s.supplierId === formData.SupplierId);
        if (supplier) {
          setSelectedSupplier({ id: supplier.supplierId, name: supplier.supplierName });
          setSuppliers(prev => {
            if (!prev.some(s => s.id === supplier.supplierId)) {
              return [{ id: supplier.supplierId, name: supplier.supplierName }, ...prev];
            }
            return prev;
          });
        } 
      });
    }
  }, [formData.SupplierId]);

  // Handle search input
  const handleProductSearch = (event, value) => {
    setProductSearch(value);
    setProductPage(1);
    debouncedFetchProducts(value, 1);
  };

  const handleSupplierSearch = (event, value) => {
    setSupplierSearch(value);
    setSupplierPage(1);
    debouncedFetchSuppliers(value, 1);
  };

  // Handle scroll for infinite loading
  const handleProductScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10 &&
      !productLoading &&
      hasMoreProducts
    ) {
      const nextPage = productPage + 1;
      setProductPage(nextPage);
      debouncedFetchProducts(productSearch, nextPage);
    }
  };

  const handleSupplierScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10 &&
      !supplierLoading &&
      hasMoreSuppliers
    ) {
      const nextPage = supplierPage + 1;
      setSupplierPage(nextPage);
      debouncedFetchSuppliers(supplierSearch, nextPage);
    }
  };

  // Debug logs
  console.log('Current formData:', formData);
  console.log('Available companies:', companiesData);
  console.log('Available stores:', storesData);
  console.log('Available products:', products);
  console.log('Available suppliers:', suppliers);
  console.log('Selected supplier:', selectedSupplier);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Purchase Number"
        value={formData.PurchaseNumber || ''}
        onChange={handleInputChange('purchase', 'PurchaseNumber')}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Reference No"
        value={formData.ReferenceNo || ''}
        onChange={handleInputChange('purchase', 'ReferenceNo')}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Notes"
        value={formData.Notes || ''}
        onChange={handleInputChange('purchase', 'Notes')}
        multiline
        rows={3}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Purchase Give Date"
        type="date"
        value={formData.PurchaseGiveDate || ''}
        onChange={handleInputChange('purchase', 'PurchaseGiveDate')}
        InputLabelProps={{ shrink: true }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Purchase Receive Date"
        type="date"
        value={formData.PurchaseReceiveDate || ''}
        onChange={handleInputChange('purchase', 'PurchaseReceiveDate')}
        InputLabelProps={{ shrink: true }}
        sx={fieldStyles}
      />
      <Select
        fullWidth
        value={formData.PurchaseStatus || 'Pending'}
        onChange={handleInputChange('purchase', 'PurchaseStatus')}
        sx={selectStyles}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Confirmed">Confirmed</MenuItem>
        <MenuItem value="Shipped">Shipped</MenuItem>
        <MenuItem value="Delivered">Delivered</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>
      <Select
        fullWidth
        value={formData.PaymentStatus || 'Unpaid'}
        onChange={handleInputChange('purchase', 'PaymentStatus')}
        sx={selectStyles}
      >
        <MenuItem value="Unpaid">Unpaid</MenuItem>
        <MenuItem value="Paid">Paid</MenuItem>
        <MenuItem value="Partially Paid">Partially Paid</MenuItem>
      </Select>
      <TextField
        fullWidth
        label="Unit Price"
        type="number"
        value={formData.UnitPrice || ''}
        onChange={handleInputChange('purchase', 'UnitPrice')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Purchase Quantity"
        type="number"
        value={formData.PurchaseQuantity || ''}
        onChange={handleInputChange('purchase', 'PurchaseQuantity')}
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Receive Quantity"
        type="number"
        value={formData.ReceiveQuantity || ''}
        onChange={handleInputChange('purchase', 'ReceiveQuantity')}
        inputProps={{ min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Total Price"
        type="number"
        value={formData.TotalPrice || ''}
        onChange={handleInputChange('purchase', 'TotalPrice')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Discount"
        type="number"
        value={formData.Discount || ''}
        onChange={handleInputChange('purchase', 'Discount')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Tax Amount"
        type="number"
        value={formData.TaxAmount || ''}
        onChange={handleInputChange('purchase', 'TaxAmount')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Shipping Charges"
        type="number"
        value={formData.ShippingCharges || ''}
        onChange={handleInputChange('purchase', 'ShippingCharges')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Grand Total"
        type="number"
        value={formData.GrandTotal || ''}
        onChange={handleInputChange('purchase', 'GrandTotal')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Total Payment"
        type="number"
        value={formData.TotalPayment || ''}
        onChange={handleInputChange('purchase', 'TotalPayment')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Paid Payment"
        type="number"
        value={formData.PaidPayment || ''}
        onChange={handleInputChange('purchase', 'PaidPayment')}
        inputProps={{ step: '0.01', min: '0' }}
        sx={fieldStyles}
      />
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.name || ''}
        value={products.find(p => String(p.id) === String(formData.ProductId)) || null}
        onChange={(event, newValue) => {
          const productId = newValue?.id !== undefined && newValue?.id !== null ? newValue.id : '';
          handleInputChange('purchase', 'ProductId')(null, productId);
        }}
        onInputChange={handleProductSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Product"
            required
            sx={fieldStyles}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {productLoading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        ListboxProps={{ onScroll: handleProductScroll }}
        sx={selectStyles}
      />
      <Autocomplete
        options={suppliers}
        getOptionLabel={(option) => option.name || ''}
        value={selectedSupplier || (formData.SupplierId ? suppliers.find(s => String(s.id) === String(formData.SupplierId)) : null)}
        onChange={(event, newValue) => {
          setSelectedSupplier(newValue);
          const supplierId = newValue?.id !== undefined && newValue?.id !== null ? newValue.id : '';
          handleInputChange('purchase', 'SupplierId')(null, supplierId);
        }}
        onInputChange={handleSupplierSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Supplier"
            required
            sx={fieldStyles}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {supplierLoading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        ListboxProps={{ onScroll: handleSupplierScroll }}
        sx={selectStyles}
      />
      <Select
        fullWidth
        value={formData.CompanyId !== undefined && formData.CompanyId !== null && formData.CompanyId !== '' ? formData.CompanyId : ''}
        onChange={handleInputChange('purchase', 'CompanyId')}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || selected === '') return 'Select Company';
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
        value={formData.StoreId !== undefined && formData.StoreId !== null && formData.StoreId !== '' ? formData.StoreId : ''}
        onChange={handleInputChange('purchase', 'StoreId')}
        displayEmpty
        disabled={!formData.CompanyId}
        renderValue={(selected) => {
          if (!selected || selected === '') return 'Select Store';
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
PurchaseProductFormStep.propTypes = {
  formData: PropTypes.shape({
    PurchaseNumber: PropTypes.string,
    ReferenceNo: PropTypes.string,
    Notes: PropTypes.string,
    PurchaseGiveDate: PropTypes.string,
    PurchaseReceiveDate: PropTypes.string,
    PurchaseStatus: PropTypes.string,
    PaymentStatus: PropTypes.string,
    UnitPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PurchaseQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ReceiveQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TotalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TaxAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ShippingCharges: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    GrandTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TotalPayment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PaidPayment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    SupplierId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

PurchaseProductFormStep.defaultProps = {
  formData: {},
  companiesData: [],
  storesData: [],
};

export default PurchaseProductFormStep;