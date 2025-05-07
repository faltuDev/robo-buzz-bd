import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, ChevronLeft, Star, Plus, Minus, Share2, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const productRef = ref(database, 'products');
        const snapshot = await get(productRef);
        
        if (snapshot.exists()) {
          const products = Object.values(snapshot.val()) as Product[];
          const foundProduct = products.find(p => p.id === id);
          
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Get related products
            const related = products
              .filter(p => p.category === foundProduct.category && p.id !== id)
              .slice(0, 4);
            
            setRelatedProducts(related);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.title} - RoboBuzz BD`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.title} - RoboBuzz BD`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} - RoboBuzz BD`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image} />
      </Helmet>
      
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
        
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <motion.img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-amber-400 mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                      stroke="currentColor"
                    />
                  ))}
                  <span className="ml-2 text-gray-700">{product.rating}</span>
                </div>
                <span className="text-gray-500">In Stock: {product.stock}</span>
              </div>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">৳{product.price}</p>
                {product.freeDelivery && (
                  <div className="inline-flex items-center space-x-1 free-delivery-badge">
                    <Truck size={14} />
                    <span>Free Delivery</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 rounded-l-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <input 
                    type="number" 
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 p-2 text-center border-y border-gray-300"
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 rounded-r-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                
                <button className="btn-secondary flex items-center space-x-2">
                  <Heart size={18} />
                  <span>Add to Wishlist</span>
                </button>
                
                <button className="btn-secondary flex items-center space-x-2">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title">Related Products</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProductDetailsPage;