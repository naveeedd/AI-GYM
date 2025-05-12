
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { user, profile } = useAuth();
  
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

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gym-secondary hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-10 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search members, orders, or inventory..." 
                className="py-2 pl-10 pr-4 rounded-md bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 w-64 lg:w-96"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-md text-gray-500 hover:text-gym-secondary hover:bg-gray-100 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              5
            </span>
          </button>

          <div className="flex items-center">
            <Avatar className="h-8 w-8 border-2 border-gym-secondary">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Admin Avatar" />
              ) : (
                <AvatarFallback>{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <span className="ml-2 font-medium text-gray-700 hidden md:block">
              {profile?.full_name || user?.email?.split('@')[0] || 'Admin User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
