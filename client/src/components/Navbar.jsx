import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogOut, User, Settings, Menu, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, children, className = "" }) => (
    <Link 
      to={to} 
      onClick={closeMobileMenu}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActiveTab(to)
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-lg border-b-2 border-blue-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Booqly
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink to="/books">
                Books
              </NavLink>
              <NavLink to="/borrows">
                My Borrows
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/admin" className="bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600">
                    Admin Panel
                  </NavLink>
                  {/* <NavLink to="/admin/overdue" className="bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Overdue
                  </NavLink> */}
                </>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <NavLink to="/dashboard" className="block w-full text-center">
                  Dashboard
                </NavLink>
                <NavLink to="/books" className="block w-full text-center">
                  Books
                </NavLink>
                <NavLink to="/borrows" className="block w-full text-center">
                  My Borrows
                </NavLink>
                {isAdmin && (
                  <>
                    <NavLink to="/admin" className="block w-full text-center bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600">
                      Admin Panel
                    </NavLink>
                    {/* <NavLink to="/admin/overdue" className="block w-full text-center bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Overdue Books
                    </NavLink> */}
                  </>
                )}
              </div>

              {/* Mobile User Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 