import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Product, Category } from '../types';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/search/SearchBar';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category');
  const featuredParam = searchParams.get('featured') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const productsRef = ref(database, 'products');
        const productsSnapshot = await get(productsRef);
        
        if (productsSnapshot.exists()) {
          const allProducts = Object.values(productsSnapshot.val()) as Product[];
          setProducts(allProducts);
        }
        
        // Fetch categories
        const categoriesRef = ref(database, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        
        if (categoriesSnapshot.exists()) {
          setCategories(Object.values(categoriesSnapshot.val()) as Category[]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters whenever search params or filter states change
  useEffect(() => {
    if (products.length === 0) return;
    
    let filtered = [...products];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryParam && categoryParam !== 'all') {
      setSelectedCategory(categoryParam);
      filtered = filtered.filter(product => {
        const category = categories.find(c => c.id === categoryParam);
        return category ? product.category === category.name : true;
      });
    }
    
    // Filter by featured
    if (featuredParam) {
      filtered = filtered.filter(product => product.featured);
    }
    
    // Apply current filter states
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const category = categories.find(c => c.id === selectedCategory);
        return category ? product.category === category.name : true;
      });
    }
    
    // Price range filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Free delivery filter
    if (freeDeliveryOnly) {
      filtered = filtered.filter(product => product.freeDelivery);
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      // For relevance, keep original order
    }
    
    setFilteredProducts(filtered);
  }, [
    products, 
    query, 
    categoryParam, 
    featuredParam, 
    selectedCategory, 
    priceRange, 
    freeDeliveryOnly, 
    sortBy,
    categories
  ]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/search?category=${categoryId}`, { replace: true });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setFreeDeliveryOnly(false);
    setSortBy('relevance');
    navigate('/search', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Search Results for "${query}"` : 
            featuredParam ? 'Featured Products' : 
            categoryParam ? `${categories.find(c => c.id === categoryParam)?.name || 'Products'}` : 
            'All Products'}
        </h1>
        
        <div className="mb-4">
          <SearchBar />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <p className="text-gray-600 mr-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-1 text-primary-600 bg-primary-50 px-3 py-1 rounded-full text-sm"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="py-2 px-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-primary-600 text-sm hover:text-primary-700"
              >
                Reset
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="category-all" 
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => handleCategoryChange('all')}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="category-all" className="text-gray-700">All Categories</label>
                </div>
                
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`category-${category.id}`} 
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-gray-700">{category.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Min</label>
                    <input 
                      type="number" 
                      min="0"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Max</label>
                    <input 
                      type="number" 
                      min="0"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Free Delivery */}
            <div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="free-delivery" 
                  checked={freeDeliveryOnly}
                  onChange={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="free-delivery" className="text-gray-700">Free Delivery Only</label>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Filters - Mobile */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white h-full w-4/5 max-w-xs overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4">
                {/* Mobile Filters - Same as desktop */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="m-category-all" 
                        name="m-category"
                        checked={selectedCategory === 'all'}
                        onChange={() => handleCategoryChange('all')}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="m-category-all" className="text-gray-700">All Categories</label>
                    </div>
                    
                    {categories.map(category => (
                      <div key={`m-${category.id}`} className="flex items-center">
                        <input 
                          type="radio" 
                          id={`m-category-${category.id}`} 
                          name="m-category"
                          checked={selectedCategory === category.id}
                          onChange={() => handleCategoryChange(category.id)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`m-category-${category.id}`} className="text-gray-700">{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Min</label>
                        <input 
                          type="number" 
                          min="0"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full p-2 rounded border"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Max</label>
                        <input 
                          type="number" 
                          min="0"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full p-2 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="m-free-delivery" 
                      checked={freeDeliveryOnly}
                      onChange={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="m-free-delivery" className="text-gray-700">Free Delivery Only</label>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={resetFilters}
                    className="btn-secondary flex-1"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="btn-primary flex-1"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-bold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button onClick={resetFilters} className="btn-primary">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;