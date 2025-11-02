import React, { useState, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, User,Edit,Trash2,Eye } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import SupplierFormStep from '../../sections/supplier/SupplierFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { GetSupplier, AddSupplier } from '../../api/supplier';

const SupplierPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Supplier Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      SupplierName: '',
      Address: '',
      PhoneNumber: '',
      Email: ''
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    // Fetch suppliers with react-query
    const { data: suppliersResponse = { items: [], totalCount: 0 }, isLoading: isSuppliersLoading } = useQuery({
      queryKey: ['suppliers', page, pageSize, search],
      queryFn: () => GetSupplier(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform supplier data for DataTable
    const transformedSuppliers = suppliersResponse.items.map(supplier => ({
      id: supplier.supplierId,
      supplierName: supplier.supplierName,
      address: supplier.address,
      phoneNumber: supplier.phoneNumber,
      email: supplier.email
    }));

    // Mutation for supplier creation
    const supplierMutation = useMutation({
      mutationFn: () => AddSupplier(formData),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Supplier created successfully', severity: 'success' });
        queryClient.invalidateQueries(['suppliers']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({ open: true, message: `Failed to create supplier: ${error.response?.data?.message || error.message}`, severity: 'error' });
      },
    });

    const handleInputChange = (section, field) => (event) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        SupplierName: '',
        Address: '',
        PhoneNumber: '',
        Email: ''
      });
    };

    const handleSubmit = () => {
      console.log('Submitting payload:', formData);
      supplierMutation.mutate();
    };

    const isStepValid = () => {
      return !!formData.SupplierName && !!formData.Email;
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
      console.log('Searching suppliers with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for suppliers
    const columns = [
      { accessor: 'supplierName', header: 'Name', flex: 1, minWidth: 150 },
      { accessor: 'address', header: 'Address', flex: 1, minWidth: 200, render: (value) => value ?? 'N/A' },
      { accessor: 'phoneNumber', header: 'Phone Number', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
      { accessor: 'email', header: 'Email', flex: 1, minWidth: 200 },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('View supplier:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          setFormData({
            SupplierName: item.supplierName,
            Address: item.address,
            PhoneNumber: item.phoneNumber,
            Email: item.email
          });
          setOpen(true);
        },
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => console.log('Delete supplier:', item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    return (
      <MainCard title={title}>
        {isSuppliersLoading || supplierMutation.isLoading ? <Loader /> : null}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {suppliersResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <User size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Suppliers Added
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
              Add Supplier
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <DataTable
              data={transformedSuppliers}
              columns={columns}
              tableTitle="Suppliers"
              TableIcon={User}
              handleOpenModal={() => setOpen(true)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={suppliersResponse.totalCount}
              currentPage={page}
              itemsPerPage={pageSize}
              isLoading={isSuppliersLoading || supplierMutation.isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Supplier Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title="Create Supplier"
          isMultiStep={false}
          isLoading={supplierMutation.isLoading}
        >
          <SupplierFormStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </GenericFormModal>
      </MainCard>
    );
  }
);

export default SupplierPage;