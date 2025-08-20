
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, useContext } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import LoginPage from 'pages/auth/Login';
import { AuthContext } from 'contexts/AuthContext';
import CompanyPage from 'pages/company/company';

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
        { path: 'typography', element: <Typography /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> },
        {
          path: 'company',
          element: (
            <ProtectedRoute>
              <CompanyPage />
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
