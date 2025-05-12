
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect based on user role
  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin" : "/user";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <span className="text-gym-secondary font-bold text-7xl md:text-9xl">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gym-primary mb-6">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link to={getDashboardLink()}>
            <Button className="w-full bg-gym-secondary hover:bg-opacity-90">
              {user ? 'Return to Dashboard' : 'Return to Homepage'}
            </Button>
          </Link>
          
          <p className="text-gray-500">
            Lost? <Link to="/" className="text-gym-secondary hover:underline">Visit our homepage</Link> or{" "}
            <Link to="/login" className="text-gym-secondary hover:underline">sign in</Link> to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
