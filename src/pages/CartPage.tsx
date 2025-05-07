import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };
  
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
          <span>Continue Shopping</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {cart.items.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    {cart.totalItems} {cart.totalItems === 1 ? 'Item' : 'Items'}
                  </h2>
                  
                  <button 
                    onClick={clearCart}
                    className="text-error-500 text-sm flex items-center hover:underline"
                  >
                    <Trash2 size={16} className="mr-1" />
                    <span>Clear Cart</span>
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {cart.items.map((item) => (
                  <motion.div 
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 flex items-center"
                  >
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <Link 
                        to={`/product/${item.productId}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {item.product.title}
                      </Link>
                      
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>Price: ৳{item.product.price}</p>
                        {item.product.freeDelivery && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Free Delivery
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="w-6 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className="font-semibold">৳{item.product.price * item.quantity}</p>
                      
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="mt-1 text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{cart.totalPrice}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success-500">Free</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>৳{cart.totalPrice}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="btn-primary w-full flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>Proceed to Checkout</span>
              </button>
              
              <p className="mt-4 text-xs text-gray-500 text-center">
                By proceeding to checkout, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;