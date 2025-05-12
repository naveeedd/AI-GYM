
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  ShoppingCart, 
  ScrollText, 
  Dumbbell, 
  Tablet, 
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar = ({ isOpen }: DashboardSidebarProps) => {
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
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/user',
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      title: 'My Subscription',
      path: '/user/subscription',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: 'Attendance History',
      path: '/user/attendance',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Shop Products',
      path: '/user/products',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: 'Diet Plans',
      path: '/user/diet-plans',
      icon: <ScrollText className="h-5 w-5" />
    },
    
    {
      title: 'Workout Tutorials',
      path: '/user/workout-tutorials',
      icon: <Tablet className="h-5 w-5" />
    },
    {
      title: 'Profile Settings',
      path: '/user/profile',
      icon: <User className="h-5 w-5" />
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
      "bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isOpen ? (
            <Link to="/" className="flex items-center">
              <span className="text-gym-primary font-bold text-xl">FitLife</span>
              <span className="text-gym-secondary font-bold text-xl">Gym</span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <span className="text-gym-secondary font-bold text-xl">F</span>
            </Link>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center py-6 border-b border-gray-200">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-gym-secondary">
              {profile?.avatar_url ? (
                <AvatarImage 
                  src={profile.avatar_url} 
                  alt="User Avatar"
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3"></span>
          </div>
          {isOpen && (
            <div className="mt-3 text-center">
              <h3 className="font-medium text-gym-primary">
                {profile?.full_name || user?.email?.split('@')[0] || 'Member'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
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
                  ? "bg-gym-secondary bg-opacity-10 text-gym-secondary" 
                  : "text-gray-600 hover:bg-gray-100",
                !isOpen && "justify-center"
              )}
            >
              {item.icon}
              {isOpen && <span className="ml-3 font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => logout()}
            className={cn(
              "flex items-center py-2.5 px-3 rounded-md transition-all w-full text-red-500 hover:bg-red-50",
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

export default DashboardSidebar;
