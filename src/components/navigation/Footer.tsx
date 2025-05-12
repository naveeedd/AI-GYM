
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gym-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-white font-bold text-2xl">FitLife</span>
              <span className="text-gym-secondary font-bold text-2xl">Gym</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Transforming lives through fitness and wellness since 2010. Join us on the journey to a healthier you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-gym-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-gym-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-gym-secondary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gym-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#memberships" className="text-gray-300 hover:text-gym-secondary transition-colors">
                  Memberships
                </Link>
              </li>
              <li>
                <Link to="/#nutrition" className="text-gray-300 hover:text-gym-secondary transition-colors">
                  Nutrition Products
                </Link>
              </li>
              <li>
                <Link to="/#locations" className="text-gray-300 hover:text-gym-secondary transition-colors">
                  Gym Locations
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-gym-secondary transition-colors">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gym-secondary" />
                <span className="text-gray-300">
                  123 Fitness Street, Workout City, WC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-gym-secondary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gym-secondary" />
                <span className="text-gray-300">info@fitlifegym.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Join Our Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get the latest updates on promotions and fitness tips.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gym-secondary"
              />
              <button 
                type="submit" 
                className="bg-gym-secondary hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© {currentYear} FitLife Gym. All rights reserved.</p>
          <div className="flex justify-center mt-2 space-x-4 text-sm">
            <Link to="#" className="hover:text-gym-secondary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gym-secondary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-gym-secondary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
