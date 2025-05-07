import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 h-48">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {product.freeDelivery && (
            <div className="absolute top-2 left-2 flex items-center space-x-1 free-delivery-badge">
              <Truck size={12} />
              <span>Free Delivery</span>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-white text-primary-600 p-2 rounded-full shadow-md hover:bg-primary-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-1">{product.title}</h3>
          
          <div className="flex items-center mt-1 mb-2">
            <div className="flex items-center text-amber-400 mr-2">
              <Star size={14} fill="currentColor" />
              <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">In Stock: {product.stock}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-900">৳{product.price}</p>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;