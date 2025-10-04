import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, Package ,Eye,Edit,Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import ProductFormStep from '../../sections/product/ProductFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCompanies, getStoresByCompany, GetProduct, AddProduct,GetCategory } from '../../api/product';

const ProductPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Product Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      Name: '',
      Description: '',
      PurchasePrice: '',
      SalePrice: '',
      QuantityInStock: '',
      CategoryId: '',
      CompanyId: '',
      StoreId: '',
      RemainingQuantity: '',
      TotalSoldQuantity: '',
      ReturnedQuantity: '',
      Unit: ''
    });
    const [companies, setCompanies] = useState([]);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    // Fetch companies
    useEffect(() => {
      getCompanies().then(data => {
        const transformedCompanies = data.map(company => ({
          id: company.companyId,
          name: company.companyName
        }));
        console.log('Transformed companies:', transformedCompanies);
        setCompanies(transformedCompanies);
      }).catch(error => {
        console.error('Failed to fetch companies:', error);
        setCompanies([]);
      });
    }, []);

    // Fetch stores when CompanyId changes
    useEffect(() => {
      if (formData.CompanyId) {
        getStoresByCompany(formData.CompanyId).then(data => {
          const transformedStores = data.map(store => ({
            id: store.storeId,
            name: store.storeName
          }));
          console.log('Transformed stores:', transformedStores);
          setStores(transformedStores);
        }).catch(error => {
          console.error('Failed to fetch stores:', error);
          setStores([]);
        });
      } else {
        setStores([]);
      }
    }, [formData.CompanyId]);

    // Reset StoreId when CompanyId changes or stores change
    useEffect(() => {
      if (formData.StoreId && !stores.some(s => s.id === formData.StoreId)) {
        setFormData(prev => ({ ...prev, StoreId: '' }));
      }
    }, [formData.StoreId, stores]);

    // Fetch categories
    useEffect(() => {
      if (formData.StoreId) {
        GetCategory(formData.StoreId).then(data => {
          console.log('Categories:', data);
          const transformedCategories = data.map(category => ({
            id: category.categoryId,
            name: category.categoryName,
          }));
          console.log('Transformed categories:', transformedCategories);
          setCategories(transformedCategories);
        }).catch(error => {
          console.error('Failed to fetch categories:', error);
          setCategories([]);
        });
      } else {
        setCategories([]);
      }
    }, [formData.StoreId]);

    // Reset CategoryId when StoreId changes or categories change
    useEffect(() => {
      if (formData.CategoryId && !categories.some(c => c.id === formData.CategoryId)) {
        setFormData(prev => ({ ...prev, CategoryId: '' }));
      }
    }, [formData.CategoryId, categories]);

    // Fetch products with react-query
    const { data: productsResponse = { items: [], totalCount: 0 }, isLoading: isProductsLoading } = useQuery({
      queryKey: ['products', page, pageSize, search],
      queryFn: () => GetProduct(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform product data for DataTable
    const transformedProducts = productsResponse.items.map(product => ({
      id: product.productId,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      quantityInStock: product.quantityInStock,
      categoryName: product.categoryName,
      companyName: product.companyName,
      storeName: product.storeName,
      remainingQuantity: product.remainingQuantity,
      totalSoldQuantity: product.totalSoldQuantity,
      returnedQuantity: product.returnedQuantity,
      unit: product.unit,
      categoryId: product.categoryId,
      companyId: product.companyId,
      storeId: product.storeId
    }));

    // Mutation for product creation
    const productMutation = useMutation({
      mutationFn: () => AddProduct(formData),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Product created successfully', severity: 'success' });
        queryClient.invalidateQueries(['products']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({ open: true, message: `Failed to create product: ${error.response?.data?.message || error.message}`, severity: 'error' });
      },
    });

    const handleInputChange = (section, field) => (event) => {
      const value = ['PurchasePrice', 'SalePrice', 'QuantityInStock', 'CategoryId', 'CompanyId', 'StoreId', 'RemainingQuantity', 'TotalSoldQuantity', 'ReturnedQuantity'].includes(field)
        ? Number(event.target.value)
        : event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        Name: '',
        Description: '',
        PurchasePrice: '',
        SalePrice: '',
        QuantityInStock: '',
        CategoryId: '',
        CompanyId: '',
        StoreId: '',
        RemainingQuantity: '',
        TotalSoldQuantity: '',
        ReturnedQuantity: '',
        Unit: ''
      });
      setStores([]);
    };

    const handleSubmit = () => {
      console.log('Submitting payload:', formData);
      productMutation.mutate();
    };

    const isStepValid = () => {
      return !!formData.Name && !!formData.PurchasePrice && !!formData.SalePrice && !!formData.QuantityInStock && !!formData.CategoryId && !!formData.CompanyId && !!formData.StoreId && !!formData.Unit;
    };

    const handlePageChange = (tab, newPage) => {
      console.log('Changing page to', newPage);
      setPage(newPage);
    };

    const handlePageSizeChange = (tab, size) => {
      console.log('Changing page size to', size);
      setPageSize(size);
      setPage(1);
    };

    const handleSearch = (tab, searchTerm) => {
      console.log('Searching products with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for products
    const columns = [
      { accessor: 'name', header: 'Name', flex: 1, minWidth: 150 },
      { accessor: 'description', header: 'Description', flex: 1, minWidth: 200 },
      { 
        accessor: 'purchasePrice', 
        header: 'Purchase Price', 
        flex: 1, 
        minWidth: 120,
        render: (value) => `$${value.toFixed(2)}`
      },
      { 
        accessor: 'salePrice', 
        header: 'Sale Price', 
        flex: 1, 
        minWidth: 120,
        render: (value) => `$${value.toFixed(2)}`
      },
      { accessor: 'quantityInStock', header: 'Stock', flex: 1, minWidth: 100 },
      { accessor: 'categoryName', header: 'Category', flex: 1, minWidth: 150 },
      { accessor: 'companyName', header: 'Company', flex: 1, minWidth: 150 },
      { accessor: 'storeName', header: 'Store', flex: 1, minWidth: 150 },
      { accessor: 'remainingQuantity', header: 'Remaining', flex: 1, minWidth: 100 },
      { accessor: 'totalSoldQuantity', header: 'Sold', flex: 1, minWidth: 100 },
      { accessor: 'returnedQuantity', header: 'Returned', flex: 1, minWidth: 100 },
      { accessor: 'unit', header: 'Unit', flex: 1, minWidth: 100 },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('View product:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          setFormData({
            Name: item.name,
            Description: item.description,
            PurchasePrice: item.purchasePrice,
            SalePrice: item.salePrice,
            QuantityInStock: item.quantityInStock,
            CategoryId: item.categoryId,
            CompanyId: item.companyId,
            StoreId: item.storeId,
            RemainingQuantity: item.remainingQuantity,
            TotalSoldQuantity: item.totalSoldQuantity,
            ReturnedQuantity: item.returnedQuantity,
            Unit: item.unit
          });
          setOpen(true);
        },
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => console.log('Delete product:', item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    return (
      <MainCard title={title}>
        {isProductsLoading || productMutation.isLoading ? <Loader /> : null}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {productsResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <Package size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Products Added
            </Typography>
            <Button
              onClick={() => setOpen(true)}
              startIcon={<Plus size={18} />}
              variant="contained"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: '0.875rem',
                textTransform: 'none',
                bgcolor: 'primary.main',
                ':hover': { bgcolor: 'primary.dark' },
              }}
            >
              Add Product
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <DataTable
              data={transformedProducts}
              columns={columns}
              tableTitle="Products"
              TableIcon={Package}
              handleOpenModal={() => setOpen(true)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={productsResponse.totalCount}
              currentPage={page}
              itemsPerPage={pageSize}
              isLoading={isProductsLoading || productMutation.isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Product Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title="Create Product"
          isMultiStep={false}
        >
          <ProductFormStep
            formData={formData}
            handleInputChange={handleInputChange}
            companiesData={companies}
            storesData={stores}
            categoriesData={categories}
          />
        </GenericFormModal>
      </MainCard>
    );
  }
);

export default ProductPage;