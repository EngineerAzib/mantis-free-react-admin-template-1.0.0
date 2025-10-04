import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, Building2, Store, Users ,Eye,Edit,Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import TabsSection from '../../components/TabsSection';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import CompanyFormStep from '../../sections/company/CompanyFormStep';
import StoreFormStep from '../../sections/company/StoreFormStep';
import UserFormStep from '../../sections/company/UserFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import * as functions from './CompanyPageFunctions';

const CompanyPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Company Management',
    companySteps = ['Company Info', 'Store Info', 'User Info'],
  }) => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('companies');
    const [modalState, setModalState] = useState({ type: null, open: false, activeStep: 0 });
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      company: {
        name: '',
        ntn: '',
        companyEmail: '',
        phoneNumber: '',
        foundedDate: '',
        storeName: '',
        storeCode: '',
        storeEmail: '',
        storePhone: '',
        isMainBranch: false,
        address: '',
        fullName: '',
        userAddress: '',
        cnic: '',
        gender: '',
        userName: '',
        userEmail: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
     store: { 
    StoreName: '',
    StoreCode: '',
    companyId: '',
    Email: '',
    Phone: '',
    IsMainBranch: false,
    Address: '' 
  },
      user: { name: '', email: '', role: '', companyId: '', storeId: '', joinDate: '' },
      ...initialData,
    });

    // Pagination and search states
    const [companyPage, setCompanyPage] = useState(1);
    const [companyPageSize, setCompanyPageSize] = useState(10);
    const [companySearch, setCompanySearch] = useState('');
    const [storePage, setStorePage] = useState(1);
    const [storePageSize, setStorePageSize] = useState(10);
    const [storeSearch, setStoreSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [userPageSize, setUserPageSize] = useState(10);
    const [userSearch, setUserSearch] = useState('');

    // Fetch data with react-query
    const { data: companiesResponse = { items: [], totalCount: 0 }, isLoading: isCompaniesLoading } = useQuery({
      queryKey: ['companies', companyPage, companyPageSize, companySearch],
      queryFn: () => functions.initialCompaniesData(companyPage, companyPageSize, companySearch),
      staleTime: 5 * 60 * 1000,
    });

    const { data: storesResponse = { items: [], totalCount: 0 }, isLoading: isStoresLoading } = useQuery({
      
      queryKey: ['stores', storePage, storePageSize, storeSearch],
      queryFn: () => functions.initialStoresData(storePage, storePageSize, storeSearch),
      staleTime: 5 * 60 * 1000,
    });

    const { data: usersResponse = { items: [], totalCount: 0 }, isLoading: isUsersLoading } = useQuery({
      queryKey: ['users', userPage, userPageSize, userSearch],
      queryFn: () => functions.initialUsersData(userPage, userPageSize, userSearch),
      staleTime: 5 * 60 * 1000,
    });

    // Mutations for form submissions
    const companyMutation = useMutation({
      mutationFn: () => functions.handleCompanySubmit(formData, queryClient, setMessage, functions.handleClose(setModalState, setFormData, initialData)),
    });

    const storeMutation = useMutation({
      mutationFn: () =>
        functions.handleStoreSubmit(
          formData,
          companiesResponse.items,
          storesResponse.items,
          onSubmit,
          queryClient,
          setMessage,
          functions.handleClose(setModalState, setFormData, initialData)
        ),
    });

    const userMutation = useMutation({
      mutationFn: () =>
        functions.handleUserSubmit(
          formData,
          companiesResponse.items,
          storesResponse.items,
          onSubmit,
          queryClient,
          setMessage,
          functions.handleClose(setModalState, setFormData, initialData)
        ),
    });

    // Validate activeTab
    useEffect(() => {
      console.log('CompanyPage: activeTab is', activeTab);
      if (typeof activeTab !== 'string' || !['companies', 'stores', 'users'].includes(activeTab)) {
        console.warn('Invalid activeTab value:', activeTab);
        setActiveTab('companies');
      }
    }, [activeTab]);

    // Log modal state changes
    useEffect(() => {
      console.log('CompanyPage: Modal state is', modalState);
    }, [modalState]);

    // Pagination and search handlers
    const handlePageChange = (tab, page) => {
      console.log(`Changing page for ${tab} to`, page);
      if (tab === 'companies') setCompanyPage(page);
      if (tab === 'stores') setStorePage(page);
      if (tab === 'users') setUserPage(page);
    };

    const handlePageSizeChange = (tab, size) => {
      console.log(`Changing page size for ${tab} to`, size);
      if (tab === 'companies') {
        setCompanyPageSize(size);
        setCompanyPage(1);
      }
      if (tab === 'stores') {
        setStorePageSize(size);
        setStorePage(1);
      }
      if (tab === 'users') {
        setUserPageSize(size);
        setUserPage(1);
      }
    };

    const handleSearch = (tab, search) => {
      console.log(`Searching ${tab} with term:`, search);
      if (tab === 'companies') {
        debugger
        setCompanySearch(search);
        setCompanyPage(1);
      }
      if (tab === 'stores') {
        setStoreSearch(search);
        setStorePage(1);
      }
      if (tab === 'users') {
        setUserSearch(search);
        setUserPage(1);
      }
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Get columns and table data
    const columns = functions.getTableColumns(activeTab);
    const tableData = activeTab === 'companies' ? companiesResponse.items : activeTab === 'stores' ? storesResponse.items : usersResponse.items;
    const totalCount =
      activeTab === 'companies' ? companiesResponse.totalCount : activeTab === 'stores' ? storesResponse.totalCount : usersResponse.totalCount;
    const currentPageValue = activeTab === 'companies' ? companyPage : activeTab === 'stores' ? storePage : userPage;
    const itemsPerPageValue = activeTab === 'companies' ? companyPageSize : activeTab === 'stores' ? storePageSize : userPageSize;
    const isLoading = isCompaniesLoading || isStoresLoading || isUsersLoading || companyMutation.isLoading || storeMutation.isLoading || userMutation.isLoading;

    const tableTitle = activeTab === 'companies' ? 'Companies' : activeTab === 'stores' ? 'Stores' : 'Users';
    const TableIcon = activeTab === 'companies' ? Building2 : activeTab === 'stores' ? Store : Users;

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log(`View ${activeTab.slice(0, -1)}:`, item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => handleOpenModal(activeTab.slice(0, -1)),
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => console.log(`Delete ${activeTab.slice(0, -1)}:`, item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    const tabs = [
      { id: 'companies', label: 'Companies', icon: 'Building2', count: companiesResponse.items.length },
      { id: 'stores', label: 'Stores', icon: 'Store', count: storesResponse.items.length },
      { id: 'users', label: 'Users', icon: 'Users', count: usersResponse.items.length },
    ];

    return (
      <MainCard title={title}>
        {isLoading && <Loader />}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {companiesResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <Building2 size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Companies Added
            </Typography>
            <Button
              onClick={() => functions.handleOpenModal(setModalState)('company')}
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
              Add Company
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            <DataTable
              data={tableData}
              columns={columns}
              tableTitle={tableTitle}
              TableIcon={TableIcon}
              handleOpenModal={functions.handleOpenModal(setModalState)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={totalCount}
              currentPage={currentPageValue}
              itemsPerPage={itemsPerPageValue}
              isLoading={isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={modalState.type === 'company' && modalState.open}
          activeStep={modalState.activeStep}
          steps={companySteps}
          formData={formData.company}
          handleInputChange={functions.handleInputChange(setFormData)}
          handleCheckboxChange={functions.handleCheckboxChange(setFormData)}
          handleClose={functions.handleClose(setModalState, setFormData, initialData)}
          handleNext={functions.handleNext(setModalState)}
          handleBack={functions.handleBack(setModalState)}
          handleSubmit={() => companyMutation.mutate()}
          isStepValid={(step) => {
            console.log('CompanyPage: Validating company step', step, formData.company);
            switch (step) {
              case 0:
                return !!formData.company.name;
              case 1:
                return !!formData.company.storeName;
              case 2:
                return !!formData.company.fullName && !!formData.company.password && !!formData.company.confirmPassword && !!formData.company.role;
              default:
                return false;
            }
          }}
          title="Add Company"
          isMultiStep={true}
        >
          <CompanyFormStep
            activeStep={modalState.activeStep}
            formData={formData.company}
          
            handleInputChange={functions.handleInputChange(setFormData)}
            handleCheckboxChange={functions.handleCheckboxChange(setFormData)}
            companiesData={companiesResponse.items}
          />
        </GenericFormModal>
        <GenericFormModal
          open={modalState.type === 'store' && modalState.open}
          formData={formData.store}
          handleInputChange={functions.handleInputChange(setFormData)}
          handleClose={functions.handleClose(setModalState, setFormData, initialData)}
          handleSubmit={() => storeMutation.mutate()}
          isStepValid={() => {
            const storeNameValid = !!formData.store.StoreName;
            const companyIdValid = !!formData.store.companyId;
            console.log('Store validation details:', { storeNameValid, companyIdValid, StoreName: formData.store.StoreName, companyId: formData.store.companyId });
            return storeNameValid && companyIdValid;
          }}
          title="Add Store"
          isMultiStep={false}
        >
      
          <StoreFormStep
    formData={formData.store}
    handleInputChange={functions.handleInputChange(setFormData)}
    handleCheckboxChange={functions.handleCheckboxChange(setFormData)}
    companiesData={companiesResponse.items}
  />

        </GenericFormModal>
        <GenericFormModal
          open={modalState.type === 'user' && modalState.open}
          formData={formData.user}
          handleInputChange={functions.handleInputChange(setFormData)}
          handleClose={functions.handleClose(setModalState, setFormData, initialData)}
          handleSubmit={() => userMutation.mutate()}
          isStepValid={() => {
            console.log('CompanyPage: Validating user', formData.user);
            return !!formData.user.name && !!formData.user.email && !!formData.user.role;
          }}
          title="Add User"
          isMultiStep={false}
        >
          <UserFormStep
            formData={formData.user}
            handleInputChange={functions.handleInputChange(setFormData)}
            companiesData={companiesResponse.items}
            storesData={storesResponse.items}
          />
        </GenericFormModal>
      </MainCard>
    );
  }
);

export default CompanyPage;