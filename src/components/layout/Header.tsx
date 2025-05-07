import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ShoppingCart, User, X, Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchBar from '../search/SearchBar';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close search bar when navigating
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-primary-600 flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Robo<span className="text-secondary-500">Buzz</span>
          </motion.div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
          <Link to="/search?category=all" className="text-gray-700 hover:text-primary-600 transition-colors">Products</Link>
          <Link to="/search?featured=true" className="text-gray-700 hover:text-primary-600 transition-colors">Featured</Link>
        </div>
        
        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <SearchIcon size={20} />
          </button>
          
          <Link 
            to="/cart" 
            className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </Link>
          
          {currentUser ? (
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            >
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                  {currentUser.firstName?.[0] || currentUser.email?.[0] || 'U'}
                </div>
              )}
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            >
              <User size={20} />
              <span className="hidden lg:inline">Login</span>
            </Link>
          )}
        </div>
        
        {/* Mobile Buttons */}
        <div className="flex items-center space-x-2 md:hidden">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <SearchIcon size={20} />
          </button>
          
          <Link 
            to="/cart" 
            className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full bg-white z-50 shadow-md"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="mr-2 text-gray-500"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
                <SearchBar onSearch={() => setIsSearchOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-lg">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                {currentUser ? (
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                        {currentUser.firstName?.[0] || currentUser.email?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : currentUser.email}
                      </p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 pb-4 border-b">
                    <Link 
                      to="/auth" 
                      className="btn-primary w-full flex items-center justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login / Sign up
                    </Link>
                  </div>
                )}
                
                <nav className="space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Home</span>
                    <ChevronRight size={18} />
                  </Link>
                  <Link 
                    to="/search?category=all" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>All Products</span>
                    <ChevronRight size={18} />
                  </Link>
                  <Link 
                    to="/search?featured=true" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Featured Products</span>
                    <ChevronRight size={18} />
                  </Link>
                  {currentUser && (
                    <Link 
                      to="/profile" 
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>My Profile</span>
                      <ChevronRight size={18} />
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;