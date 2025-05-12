import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, Dumbbell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('/#')) {
      // Handle hash links
      const hash = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Handle regular routes
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      return location.hash === `#${hash}`;
    }
    return location.pathname.includes(path);
  };

  const navLinks = [
    { title: 'Plans', path: '/#memberships' },
    { title: 'BMR Calculator', path: '/#bmr-calculator' },
    { title: 'Shop', path: '/#nutrition' },
    { title: 'Locations', path: '/#locations' },
  ];

  return (
    <nav className={cn(
      "fixed w-full z-30 transition-all duration-300",
      isScrolled ? "bg-gray-900 shadow-lg" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Dumbbell className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-white font-bold text-xl">FitLife</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.title}
                onClick={() => handleNavigation(link.path)}
                className={cn(
                  "text-gray-300 hover:text-white px-3 py-2 transition-colors",
                  isActive(link.path) && "text-white font-medium"
                )}
              >
                {link.title}
              </button>
            ))}
            
            {user ? (
              <>
                <Button
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/user')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-4 flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-2 flex items-center"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-4 flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-2 flex items-center"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.title}
                onClick={() => handleNavigation(link.path)}
                className={cn(
                  "w-full text-left text-gray-300 hover:text-white px-3 py-2 transition-colors",
                  isActive(link.path) && "text-white font-medium"
                )}
              >
                {link.title}
              </button>
            ))}
            
            {user ? (
              <>
                <Button
                  onClick={() => {
                    navigate(user.role === 'admin' ? '/admin' : '/user');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center mt-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center mt-2"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
