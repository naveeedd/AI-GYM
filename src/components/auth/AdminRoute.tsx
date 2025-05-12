
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, isAdmin, session } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session || !user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    // If not an admin, redirect to user dashboard instead of subscription page
    return <Navigate to="/user" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
