
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'A';
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      title: 'Attendance',
      path: '/admin/attendance',
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: 'Inventory',
      path: '/admin/inventory',
      icon: <Package className="h-5 w-5" />
    },
    {
      title: 'Members',
      path: '/admin/members',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Financials',
      path: '/admin/financials',
      icon: <BarChart3 className="h-5 w-5" />
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "bg-gym-primary text-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {isOpen ? (
            <Link to="/" className="flex items-center">
              <span className="text-white font-bold text-xl">FitLife</span>
              <span className="text-gym-secondary font-bold text-xl">Admin</span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <span className="text-gym-secondary font-bold text-xl">F</span>
            </Link>
          )}
        </div>

        {/* Admin Info */}
        <div className="flex flex-col items-center py-6 border-b border-gray-700">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-gym-secondary">
              {profile?.avatar_url ? (
                <AvatarImage 
                  src={profile.avatar_url} 
                  alt="Admin Avatar"
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-lg bg-gym-secondary bg-opacity-20">{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3"></span>
          </div>
          {isOpen && (
            <div className="mt-3 text-center">
              <h3 className="font-medium text-white">
                {profile?.full_name || user?.email?.split('@')[0] || 'Admin'}
              </h3>
              <p className="text-sm text-gray-300 mt-1">Administrator</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center py-2.5 px-3 rounded-md transition-all",
                isActive(item.path, item.exact) 
                  ? "bg-gym-secondary text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                !isOpen && "justify-center"
              )}
            >
              {item.icon}
              {isOpen && <span className="ml-3 font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => logout()}
            className={cn(
              "flex items-center py-2.5 px-3 rounded-md transition-all w-full text-gray-300 hover:bg-gray-700 hover:text-white",
              !isOpen && "justify-center"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
