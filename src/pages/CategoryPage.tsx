import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Product, Category } from '../types';
import ProductCard from '../components/products/ProductCard';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        
        // Fetch category
        const categoryRef = ref(database, `categories/${id}`);
        const categorySnapshot = await get(categoryRef);
        
        if (categorySnapshot.exists()) {
          setCategory(categorySnapshot.val() as Category);
        }
        
        // Fetch products for this category
        const productsRef = ref(database, 'products');
        const productsSnapshot = await get(productsRef);
        
        if (productsSnapshot.exists()) {
          const allProducts = Object.values(productsSnapshot.val()) as Product[];
          const categoryName = categorySnapshot.val().name;
          const categoryProducts = allProducts.filter(p => p.category === categoryName);
          
          setProducts(categoryProducts);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="mb-6 text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
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
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600">
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          </div>
        </div>
        
        <p className="text-gray-600 max-w-3xl mx-auto text-center">
          Explore our selection of high-quality {category.name.toLowerCase()} for your robotics projects. 
          We offer the best products with fast delivery across Bangladesh.
        </p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-4">There are currently no products in this category.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryPage;