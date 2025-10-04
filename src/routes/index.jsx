
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, useContext } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import LoginPage from 'pages/auth/Login';
import { AuthContext } from 'contexts/AuthContext';
import CompanyPage from 'pages/company/company';
import CategoryPage from '../pages/category/CategoryPage';
import ProductPage from '../pages/product/ProductPage';
import SupplierPage from '../pages/supplier/SupplierPage';
import PurchaseOrderPage from '../pages/purchaseOrder/PurchaseOrderPage';
import ExpensePage from '../pages/expense/ExpensePage';
import StaffPage from '../pages/staff/StaffPage';
import PosPage from '../pages/POS/PosPage';

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const ResetPassword = Loadable(lazy(() => import('sections/auth/ResetPassword')));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Redirect wrapper for /login and /reset-password
const AuthRedirectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard/default" replace /> : children;
};

// Router configuration
const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: (
        <AuthRedirectRoute>
          <LoginPage />
        </AuthRedirectRoute>
      ),
    },
    { 
      path: '/reset-password',
      element: (
        <AuthRedirectRoute>
          <ResetPassword />
        </AuthRedirectRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardDefault /> },
        { path: 'dashboard/default', element: <DashboardDefault /> },
      
        {
          path: 'company',
          element: (
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'category',
          element: (
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'product',
          element: (
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'purchase-order',
          element: (
            <ProtectedRoute>
              <PurchaseOrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'supplier',
          element: (
            <ProtectedRoute>
              <SupplierPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'expense',
          element: (
            <ProtectedRoute>
              <ExpensePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'staff',
          element: (
            <ProtectedRoute>
              <StaffPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'pos',
          element: (
            <ProtectedRoute>
              <PosPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
