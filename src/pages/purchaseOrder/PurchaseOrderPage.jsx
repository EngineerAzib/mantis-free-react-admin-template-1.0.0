import React, { useState, useEffect, memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus, ShoppingCart,Eye,Edit,Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import MainCard from '../../components/MainCard';
import DataTable from '../../components/DataTable';
import GenericFormModal from '../../sections/company/GenericFormModal';
import PurchaseProductFormStep from '../../sections/purchaseProduct/PurchaseProductFormStep';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCompanies, getStoresByCompany, GetPurchaseProduct, AddPurchaseProduct } from '../../api/purchaseProduct';

const PurchaseProductPage = memo(
  ({
    onSubmit = (data) => console.log('Submitted:', data),
    initialData = {},
    title = 'Purchase Product Management',
  }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
      PurchaseNumber: '',
      ReferenceNo: '',
      Notes: '',
      PurchaseGiveDate: '',
      PurchaseReceiveDate: '',
      PurchaseStatus: 'Pending',
      PaymentStatus: 'Unpaid',
      UnitPrice: '',
      PurchaseQuantity: '',
      ReceiveQuantity: '',
      TotalPrice: '',
      Discount: '',
      TaxAmount: '',
      ShippingCharges: '',
      GrandTotal: '',
      TotalPayment: '',
      PaidPayment: '',
      ProductId: '',
      SupplierId: '',
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

    // Fetch purchase products with react-query
    const { data: purchaseProductsResponse = { items: [], totalCount: 0 }, isLoading: isPurchaseProductsLoading } = useQuery({
      queryKey: ['purchaseProducts', page, pageSize, search],
      queryFn: () => GetPurchaseProduct(page, pageSize, search || null),
      staleTime: 5 * 60 * 1000,
    });

    // Transform purchase product data for DataTable
    const transformedPurchaseProducts = purchaseProductsResponse.items.map(purchase => ({
      id: purchase.purchaseId || purchase.purchaseNumber, // Use purchaseId if available, else purchaseNumber
      purchaseNumber: purchase.purchaseNumber,
      referenceNo: purchase.referenceNo,
      notes: purchase.notes,
      purchaseGiveDate: purchase.purchaseGiveDate ? new Date(purchase.purchaseGiveDate).toLocaleDateString() : 'N/A',
      purchaseReceiveDate: purchase.purchaseReceiveDate ? new Date(purchase.purchaseReceiveDate).toLocaleDateString() : 'N/A',
      purchaseStatus: purchase.purchaseStatus,
      paymentStatus: purchase.paymentStatus,
      unitPrice: purchase.unitPrice ? `$${purchase.unitPrice.toFixed(2)}` : 'N/A',
      purchaseQuantity: purchase.purchaseQuantity ?? 'N/A',
      receiveQuantity: purchase.receiveQuantity ?? 'N/A',
      totalPrice: purchase.totalPrice ? `$${purchase.totalPrice.toFixed(2)}` : 'N/A',
      discount: purchase.discount ? `$${purchase.discount.toFixed(2)}` : 'N/A',
      taxAmount: purchase.taxAmount ? `$${purchase.taxAmount.toFixed(2)}` : 'N/A',
      shippingCharges: purchase.shippingCharges ? `$${purchase.shippingCharges.toFixed(2)}` : 'N/A',
      grandTotal: purchase.grandTotal ? `$${purchase.grandTotal.toFixed(2)}` : 'N/A',
      totalPayment: purchase.totalPayment ? `$${purchase.totalPayment.toFixed(2)}` : 'N/A',
      paidPayment: purchase.paidPayment ? `$${purchase.paidPayment.toFixed(2)}` : 'N/A',
      productName: purchase.productName,
      supplierName: purchase.supplierName,
      companyName: purchase.companyName,
      storeName: purchase.storeName
    }));

    // Mutation for purchase product creation
    const purchaseMutation = useMutation({
      mutationFn: () => AddPurchaseProduct(formData),
      onSuccess: (response) => {
        setMessage({ open: true, message: 'Purchase product created successfully', severity: 'success' });
        queryClient.invalidateQueries(['purchaseProducts']);
        handleClose();
      },
      onError: (error) => {
        console.error('Mutation error:', error.response?.data || error.message);
        setMessage({ open: true, message: `Failed to create purchase product: ${error.response?.data?.message || error.message}`, severity: 'error' });
      },
    });

    const handleInputChange = (section, field) => (event, value) => {
      const newValue = event?.target?.value ?? value;
      const numericFields = [
        'UnitPrice',
        'PurchaseQuantity',
        'ReceiveQuantity',
        'TotalPrice',
        'Discount',
        'TaxAmount',
        'ShippingCharges',
        'GrandTotal',
        'TotalPayment',
        'PaidPayment',
        'ProductId',
        'SupplierId',
        'CompanyId',
        'StoreId'
      ];
      setFormData(prev => ({
        ...prev,
        [field]: numericFields.includes(field) ? (newValue ? Number(newValue) : '') : newValue
      }));
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        PurchaseNumber: '',
        ReferenceNo: '',
        Notes: '',
        PurchaseGiveDate: '',
        PurchaseReceiveDate: '',
        PurchaseStatus: 'Pending',
        PaymentStatus: 'Unpaid',
        UnitPrice: '',
        PurchaseQuantity: '',
        ReceiveQuantity: '',
        TotalPrice: '',
        Discount: '',
        TaxAmount: '',
        ShippingCharges: '',
        GrandTotal: '',
        TotalPayment: '',
        PaidPayment: '',
        ProductId: '',
        SupplierId: '',
        CompanyId: '',
        StoreId: ''
      });
      setStores([]);
    };

    const handleSubmit = () => {
      if (purchaseMutation.isPending) return; // Prevent multiple submissions
      console.log('Submitting payload:', formData);
      purchaseMutation.mutate();
    };

    const isStepValid = () => {
      return !!formData.PurchaseNumber &&
             !!formData.ProductId &&
             !!formData.SupplierId &&
             !!formData.CompanyId &&
             !!formData.StoreId &&
             !!formData.PurchaseStatus &&
             !!formData.PaymentStatus;
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
      console.log('Searching purchase products with term:', searchTerm);
      setSearch(searchTerm);
      setPage(1);
    };

    const handleCloseMessage = () => {
      setMessage({ open: false, message: '', severity: 'success' });
    };

    // Define table columns for purchase products
    const columns = [
      { accessor: 'purchaseNumber', header: 'Purchase Number', flex: 1, minWidth: 150 },
      { accessor: 'referenceNo', header: 'Reference No', flex: 1, minWidth: 150, render: (value) => value ?? 'N/A' },
      { accessor: 'notes', header: 'Notes', flex: 1, minWidth: 200, render: (value) => value ?? 'N/A' },
      { accessor: 'purchaseGiveDate', header: 'Give Date', flex: 1, minWidth: 120 },
      { accessor: 'purchaseReceiveDate', header: 'Receive Date', flex: 1, minWidth: 120 },
      { accessor: 'purchaseStatus', header: 'Purchase Status', flex: 1, minWidth: 120 },
      { accessor: 'paymentStatus', header: 'Payment Status', flex: 1, minWidth: 120 },
      { accessor: 'unitPrice', header: 'Unit Price', flex: 1, minWidth: 100 },
      { accessor: 'purchaseQuantity', header: 'Purchase Qty', flex: 1, minWidth: 100 },
      { accessor: 'receiveQuantity', header: 'Receive Qty', flex: 1, minWidth: 100 },
      { accessor: 'totalPrice', header: 'Total Price', flex: 1, minWidth: 100 },
      { accessor: 'discount', header: 'Discount', flex: 1, minWidth: 100 },
      { accessor: 'taxAmount', header: 'Tax Amount', flex: 1, minWidth: 100 },
      { accessor: 'shippingCharges', header: 'Shipping', flex: 1, minWidth: 100 },
      { accessor: 'grandTotal', header: 'Grand Total', flex: 1, minWidth: 100 },
      { accessor: 'totalPayment', header: 'Total Payment', flex: 1, minWidth: 120 },
      { accessor: 'paidPayment', header: 'Paid Payment', flex: 1, minWidth: 120 },
      { accessor: 'productName', header: 'Product', flex: 1, minWidth: 150 },
      { accessor: 'supplierName', header: 'Supplier', flex: 1, minWidth: 150 },
      { accessor: 'companyName', header: 'Company', flex: 1, minWidth: 150 },
      { accessor: 'storeName', header: 'Store', flex: 1, minWidth: 150 },
    ];

    const actions = [
      {
        icon: Eye,
        onClick: (item) => console.log('View purchase product:', item),
        label: 'View',
        hoverColor: 'primary.main',
      },
      {
        icon: Edit,
        onClick: (item) => {
          setFormData({
            PurchaseNumber: item.purchaseNumber,
            ReferenceNo: item.referenceNo,
            Notes: item.notes,
            PurchaseGiveDate: item.purchaseGiveDate,
            PurchaseReceiveDate: item.purchaseReceiveDate,
            PurchaseStatus: item.purchaseStatus,
            PaymentStatus: item.paymentStatus,
            UnitPrice: item.unitPrice?.replace('$', '') || '',
            PurchaseQuantity: item.purchaseQuantity || '',
            ReceiveQuantity: item.receiveQuantity || '',
            TotalPrice: item.totalPrice?.replace('$', '') || '',
            Discount: item.discount?.replace('$', '') || '',
            TaxAmount: item.taxAmount?.replace('$', '') || '',
            ShippingCharges: item.shippingCharges?.replace('$', '') || '',
            GrandTotal: item.grandTotal?.replace('$', '') || '',
            TotalPayment: item.totalPayment?.replace('$', '') || '',
            PaidPayment: item.paidPayment?.replace('$', '') || '',
            ProductId: item.productId,
            SupplierId: item.supplierId,
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
        onClick: (item) => console.log('Delete purchase product:', item),
        label: 'Delete',
        hoverColor: 'error.main',
      },
    ];

    return (
      <MainCard title={title}>
        {isPurchaseProductsLoading || purchaseMutation.isLoading ? <Loader /> : null}
        <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
        {purchaseProductsResponse.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5 } }}>
            <ShoppingCart size={56} sx={{ color: 'primary.main', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
              No Purchase Products Added
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
              Add Purchase Product
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <DataTable
              data={transformedPurchaseProducts}
              columns={columns}
              tableTitle="Purchase Products"
              TableIcon={ShoppingCart}
              handleOpenModal={() => setOpen(true)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              totalCount={purchaseProductsResponse.totalCount}
              currentPage={page}
              itemsPerPage={pageSize}
              isLoading={isPurchaseProductsLoading || purchaseMutation.isLoading}
              actions={actions}
            />
          </Box>
        )}
        <GenericFormModal
          open={open}
          activeStep={0}
          steps={['Purchase Product Details']}
          formData={formData}
          handleInputChange={handleInputChange}
          handleClose={handleClose}
          handleNext={() => {}}
          handleBack={() => {}}
          handleSubmit={handleSubmit}
          isStepValid={isStepValid}
          title="Create Purchase Product"
          isMultiStep={false}
          isSubmitting={purchaseMutation.isPending}
        >
          <PurchaseProductFormStep
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

export default PurchaseProductPage;