import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, DollarSign,Eye,Edit,Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import ExpenseFormStep from '../../sections/expense/ExpenseFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCompanies, getStoresByCompany, GetExpense, AddExpense } from '../../api/expense';

const ExpensePage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Expense Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      Name: '',
      Amount: '',
      CompanyId: '',
      StoreId: '',
      StartDate: '',
      EndDate: '',
      Notes: ''
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

    // Fetch expenses with react-query
    const { data: expenseResponse = { items: [], totalCount: 0 }, isLoading: isExpenseLoading } = useQuery({
      queryKey: ['expenses', page, pageSize, search],
      queryFn: () => GetExpense(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform expense data for DataTable
    const transformedExpenses = expenseResponse.items.map(expense => ({
      id: expense.expenseId || expense.name, // Use expenseId if available, else name
      name: expense.name,
      amount: expense.amount ? `$${expense.amount.toFixed(2)}` : 'N/A',
      companyName: expense.companyName,
      storeName: expense.storeName,
      startDate: expense.startDate ? new Date(expense.startDate).toLocaleDateString() : 'N/A',
      endDate: expense.endDate ? new Date(expense.endDate).toLocaleDateString() : 'N/A',
      notes: expense.notes
    }));

    // Mutation for expense creation
    const expenseMutation = useMutation({
      mutationFn: () => AddExpense(formData),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Expense created successfully', severity: 'success' });
        queryClient.invalidateQueries(['expenses']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({ open: true, message: `Failed to create expense: ${error.response?.data?.message || error.message}`, severity: 'error' });
      },
    });

    const handleInputChange = (section, field) => (event, value) => {
      const newValue = event?.target?.value ?? value;
      const numericFields = ['Amount', 'CompanyId', 'StoreId'];
      setFormData(prev => ({
        ...prev,
        [field]: numericFields.includes(field) ? (newValue ? Number(newValue) : '') : newValue
      }));
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        Name: '',
        Amount: '',
        CompanyId: '',
        StoreId: '',
        StartDate: '',
        EndDate: '',
        Notes: ''
      });
      setStores([]);
    };

    const handleSubmit = () => {
      if (expenseMutation.isPending) return; // Prevent multiple submissions
      console.log('Submitting payload:', formData);
      expenseMutation.mutate();
    };

    const isStepValid = () => {
      return !!formData.Name &&
             !!formData.Amount &&
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
      console.log('Searching expenses with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for expenses
    const columns = [
      { accessor: 'name', header: 'Name', flex: 1, minWidth: 150 },
      { accessor: 'amount', header: 'Amount', flex: 1, minWidth: 100 },
      { accessor: 'companyName', header: 'Company', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
      { accessor: 'storeName', header: 'Store', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
      { accessor: 'startDate', header: 'Start Date', flex: 1, minWidth: 120 },
      { accessor: 'endDate', header: 'End Date', flex: 1, minWidth: 120 },
      { accessor: 'notes', header: 'Notes', flex: 1, minWidth: 200, render: (value) => value ?? 'N/A' },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('View expense:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          setFormData({
            Name: item.name,
            Amount: item.amount?.replace('$', '') || '',
            CompanyId: item.companyId,
            StoreId: item.storeId,
            StartDate: item.startDate,
            EndDate: item.endDate,
            Notes: item.notes
          });
          setOpen(true);
        },
        label: 'Edit',
        hoverColor: 'success.main',
      },
      {
        icon: Trash2,
        onClick: (item) => console.log('Delete expense:', item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    return (
      <MainCard title={title}>
        {isExpenseLoading || expenseMutation.isLoading ? <Loader /> : null}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {expenseResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <DollarSign size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Expenses Added
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
              Add Expense
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <DataTable
              data={transformedExpenses}
              columns={columns}
              tableTitle="Expenses"
              TableIcon={DollarSign}
              handleOpenModal={() => setOpen(true)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={expenseResponse.totalCount}
              currentPage={page}
              itemsPerPage={pageSize}
              isLoading={isExpenseLoading || expenseMutation.isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Expense Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title="Create Expense"
          isMultiStep={false}
          isSubmitting={expenseMutation.isPending}
        >
          <ExpenseFormStep
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

export default ExpensePage;