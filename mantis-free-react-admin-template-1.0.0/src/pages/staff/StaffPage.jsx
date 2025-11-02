import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, User,Eye,Edit,Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import StaffFormStep from '../../sections/staff/StaffFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCompanies, getStoresByCompany, GetStaff, AddStaff } from '../../api/staff';

const StaffPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Staff Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      Name: '',
      Phone: '',
      Role: '',
      NIC_number: '',
      Address: '',
      Salary: '',
      CompanyId: '',
      StoreId: ''
    });
    const [companies, setCompanies] = useState([]);
    const [stores, setStores] = useState([]);
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
      // Reset StoreId when CompanyId changes
      if (formData.StoreId && !stores.some(s => s.id === formData.StoreId)) {
        setFormData(prev => ({ ...prev, StoreId: '' }));
      }
    }, [formData.CompanyId]);

    // Fetch staff with react-query
    const { data: staffResponse = { items: [], totalCount: 0 }, isLoading: isStaffLoading } = useQuery({
      queryKey: ['staff', page, pageSize, search],
      queryFn: () => GetStaff(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform staff data for DataTable
    const transformedStaff = staffResponse.items.map(staff => ({
      id: staff.staffId || staff.name, // Use staffId if available, else name
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      nic_number: staff.nic_number,
      address: staff.address,
      salary: staff.salary ? `$${staff.salary.toFixed(2)}` : 'N/A',
      companyName: staff.companyName,
      storeName: staff.storeName
    }));

    // Mutation for staff creation
    const staffMutation = useMutation({
      mutationFn: () => AddStaff(formData),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Staff created successfully', severity: 'success' });
        queryClient.invalidateQueries(['staff']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({ open: true, message: `Failed to create staff: ${error.response?.data?.message || error.message}`, severity: 'error' });
      },
    });

    const handleInputChange = (section, field) => (event, value) => {
      const newValue = event?.target?.value ?? value;
      const numericFields = ['Salary', 'CompanyId', 'StoreId'];
      setFormData(prev => ({
        ...prev,
        [field]: numericFields.includes(field) ? (newValue ? Number(newValue) : '') : newValue
      }));
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        Name: '',
        Phone: '',
        Role: '',
        NIC_number: '',
        Address: '',
        Salary: '',
        CompanyId: '',
        StoreId: ''
      });
      setStores([]);
    };

    const handleSubmit = () => {
      console.log('Submitting payload:', formData);
      staffMutation.mutate();
    };

    const isStepValid = () => {
      return !!formData.Name &&
             !!formData.Phone &&
             !!formData.Role &&
             !!formData.NIC_number &&
             !!formData.CompanyId &&
             !!formData.StoreId;
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
      console.log('Searching staff with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for staff
    const columns = [
      { accessor: 'name', header: 'Name', flex: 1, minWidth: 150 },
      { accessor: 'phone', header: 'Phone', flex: 1, minWidth: 120 },
      { accessor: 'role', header: 'Role', flex: 1, minWidth: 120 },
      { accessor: 'nic_number', header: 'NIC Number', flex: 1, minWidth: 150 },
      { accessor: 'address', header: 'Address', flex: 1, minWidth: 200, render: (value) => value ?? 'N/A' },
      { accessor: 'salary', header: 'Salary', flex: 1, minWidth: 100 },
      { accessor: 'companyName', header: 'Company', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
      { accessor: 'storeName', header: 'Store', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('View staff:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          setFormData({
            Name: item.name,
            Phone: item.phone,
            Role: item.role,
            NIC_number: item.nic_number,
            Address: item.address,
            Salary: item.salary?.replace('$', '') || '',
            CompanyId: item.companyId,
            StoreId: item.storeId
          });
          setOpen(true);
        },
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => console.log('Delete staff:', item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    return (
      <MainCard title={title}>
        {isStaffLoading || staffMutation.isLoading ? <Loader /> : null}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {staffResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <User size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Staff Added
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
              Add Staff
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <DataTable
              data={transformedStaff}
              columns={columns}
              tableTitle="Staff"
              TableIcon={User}
              handleOpenModal={() => setOpen(true)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={staffResponse.totalCount}
              currentPage={page}
              itemsPerPage={pageSize}
              isLoading={isStaffLoading || staffMutation.isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Staff Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title="Create Staff"
          isMultiStep={false}
          isLoading={staffMutation.isLoading}
        >
          <StaffFormStep
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

export default StaffPage;