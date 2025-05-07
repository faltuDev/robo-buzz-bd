import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { cart } = useCart();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-top border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Home size={20} className="mb-1" />
            <span className="text-xs">Home</span>
          </motion.div>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/search') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} className="mb-1" />
            <span className="text-xs">Search</span>
          </motion.div>
        </Link>
        
        <Link 
          to="/cart" 
          className={`flex flex-col items-center justify-center w-full h-full relative ${
            isActive('/cart') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingCart size={20} className="mb-1" />
            {cart.totalItems > 0 && (
              <span className="absolute top-0 right-1/4 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </motion.div>
        </Link>
        
        <Link 
          to="/chat" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/chat') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle size={20} className="mb-1" />
            <span className="text-xs">Chat</span>
          </motion.div>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/profile') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <User size={20} className="mb-1" />
            <span className="text-xs">Profile</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;