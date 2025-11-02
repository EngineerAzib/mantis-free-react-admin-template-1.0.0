import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, Folder, Eye, Edit, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import CategoryFormStep from '../../sections/category/CategoryFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCompanies, getStoresByCompany, AddCategory, UpdateCategory, DeleteCategory, GetCategory } from '../../api/category';
import { useLocation } from 'react-router-dom'; // Added for navigation debugging

const CategoryPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Category Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      Name: '',
      Description: '',
      CompanyId: '',
      StoreId: '',
    });
    const [companies, setCompanies] = useState([]);
    const [stores, setStores] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const location = useLocation(); // Added for debugging navigation

    // Debug current route
    useEffect(() => {
      console.log('CategoryPage: Current URL:', location.pathname);
    }, [location]);

    // Fetch companies
    useEffect(() => {
      getCompanies()
        .then((data) => {
          const transformedCompanies = data.map((company) => ({
            companyId: company.companyId,
            companyName: company.companyName,
          }));
          console.log('Transformed companies:', transformedCompanies);
          setCompanies(transformedCompanies);
        })
        .catch((error) => {
          console.error('Failed to fetch companies:', error);
          setCompanies([]);
        });
    }, []);

    // Fetch stores when CompanyId changes
    useEffect(() => {
      if (formData.CompanyId) {
        getStoresByCompany(formData.CompanyId)
          .then((data) => {
            const transformedStores = data.map((store) => ({
              storeId: store.storeId,
              storeName: store.storeName,
            }));
            console.log('Transformed stores:', transformedStores);
            setStores(transformedStores);
          })
          .catch((error) => {
            console.error('Failed to fetch stores:', error);
            setStores([]);
          });
      } else {
        setStores([]);
      }
    }, [formData.CompanyId]);

    // Reset StoreId when CompanyId changes or stores change
    useEffect(() => {
      if (formData.StoreId && !stores.some((s) => s.storeId === formData.StoreId)) {
        setFormData((prev) => ({ ...prev, StoreId: '' }));
      }
    }, [formData.StoreId, stores]);

    // Fetch categories with react-query
    const { data: categoriesResponse = { items: [], totalCount: 0 }, isLoading: isCategoriesLoading } = useQuery({
      queryKey: ['categories', page, pageSize, search],
      queryFn: () => GetCategory(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform category data for DataTable
    const transformedCategories = categoriesResponse.items.map((category) => ({
      id: category.categoryId,
      name: category.name,
      description: category.description,
      companyId: category.companyId,
      companyName: category.companyName,
      storeId: category.storeId,
      storeName: category.storeName,
      createdByUserName: category.createdByUserName,
      updatedByUserName: category.updatedByUserName,
    }));

    // Mutation for category creation
    const addMutation = useMutation({
      mutationFn: (data) => AddCategory(data),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Category created successfully', severity: 'success' });
        queryClient.invalidateQueries(['categories']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({
          open: true,
          message: `Failed to create category: ${error.response?.data?.message || error.message}`,
          severity: 'error',
        });
      },
    });

    // Mutation for category update
    const updateMutation = useMutation({
      mutationFn: (data) => UpdateCategory(data),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Category updated successfully', severity: 'success' });
        queryClient.invalidateQueries(['categories']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({
          open: true,
          message: `Failed to update category: ${error.response?.data?.message || error.message}`,
          severity: 'error',
        });
      },
    });

    // Mutation for category deletion
    const deleteMutation = useMutation({
      mutationFn: (id) => DeleteCategory(id),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Category deleted successfully', severity: 'success' });
        queryClient.invalidateQueries(['categories']);
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({
          open: true,
          message: `Failed to delete category: ${error.response?.data?.message || error.message}`,
          severity: 'error',
        });
      },
    });

    const handleInputChange = (section, field) => (event) => {
      const value = field === 'CompanyId' || field === 'StoreId' ? Number(event.target.value) : event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
      console.log('CategoryPage: Closing modal');
      setOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        Name: '',
        Description: '',
        CompanyId: '',
        StoreId: '',
      });
      setStores([]);
    };

    const handleSubmit = () => {
      console.log('CategoryPage: Submitting payload:', formData);
      if (isEditing) {
        updateMutation.mutate({ ...formData, CategoryId: editingId });
      } else {
        addMutation.mutate(formData);
      }
    };

    const isStepValid = () => {
      const valid = !!formData.Name && !!formData.CompanyId && !!formData.StoreId;
      console.log('CategoryPage: isStepValid:', valid, formData);
      return valid;
    };

    const handlePageChange = (tab, newPage) => {
      console.log('CategoryPage: Changing page to', newPage);
      setPage(newPage);
    };

    const handlePageSizeChange = (tab, size) => {
      console.log('CategoryPage: Changing page size to', size);
      setPageSize(size);
      setPage(1);
    };

    const handleSearch = (tab, searchTerm) => {
      console.log('CategoryPage: Searching categories with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for categories
    const columns = [
      { accessor: 'name', header: 'Name', flex: 1, minWidth: 150 },
      { accessor: 'description', header: 'Description', flex: 1, minWidth: 200 },
      { accessor: 'companyName', header: 'Company', flex: 1, minWidth: 150 },
      { accessor: 'storeName', header: 'Store', flex: 1, minWidth: 150 },
      {
        accessor: 'createdByUserName',
        header: 'Created By',
        flex: 1,
        minWidth: 150,
        render: (value) => value ?? 'N/A',
      },
      {
        accessor: 'updatedByUserName',
        header: 'Updated By',
        flex: 1,
        minWidth: 150,
        render: (value) => value ?? 'N/A',
      },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('CategoryPage: View category:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          console.log('CategoryPage: Opening modal for editing category:', item);
          setFormData({
            Name: item.name,
            Description: item.description,
            CompanyId: item.companyId,
            StoreId: item.storeId,
          });
          setEditingId(item.id);
          setIsEditing(true);
          setOpen(true); // Ensure modal opens
        },
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => {
          if (window.confirm('Are you sure you want to delete this category?')) {
            console.log('CategoryPage: Deleting category:', item.id);
            deleteMutation.mutate(item.id);
          }
        },
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    const isLoading = isCategoriesLoading || addMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

    return (
      <MainCard title={title}>
        {isLoading && <Loader />}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <DataTable
            data={transformedCategories}
            columns={columns}
            tableTitle="Categories"
            TableIcon={Folder}
            handleOpenModal={() => {
              console.log('CategoryPage: Opening modal for new category');
              setIsEditing(false);
              setEditingId(null);
              setOpen(true); // Ensure modal opens
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            totalCount={categoriesResponse.totalCount}
            currentPage={page}
            itemsPerPage={pageSize}
            isLoading={isLoading}
            actions={actions}
          />
        </Box>
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Category Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title={isEditing ? 'Edit Category' : 'Create Category'}
          isMultiStep={false}
          isLoading={isEditing ? updateMutation.isLoading : addMutation.isLoading}
        >
          <CategoryFormStep
            formData={formData}
            handleInputChange={handleInputChange}
            companiesData={companies}
            storesData={stores}
          />
        </GenericFormModal>
      </MainCard>
    );
  }
);

export default CategoryPage;