import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { ref, get, query, orderByChild, startAt, endAt } from 'firebase/database';
import { database } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        
        if (snapshot.exists()) {
          const products = Object.values(snapshot.val()) as Product[];
          const filtered = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5); // Limit to 5 suggestions
          
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    
    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      if (onSearch) onSearch();
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    if (onSearch) onSearch();
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for robotics parts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon size={18} />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto no-scrollbar"
          >
            <ul>
              {suggestions.map((product) => (
                <li 
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                >
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-gray-500">৳{product.price}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-2 border-t">
              <button
                onClick={handleSubmit}
                className="w-full py-2 text-sm text-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
              >
                See all results for "{searchTerm}"
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;