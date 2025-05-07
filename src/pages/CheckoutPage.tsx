import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    zipCode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order placement
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      clearCart();
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };
  
  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
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
        <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-primary-600">
          <ChevronLeft size={20} />
          <span>Back to Cart</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {cart.items.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="font-semibold flex items-center">
                    <Truck size={18} className="mr-2" />
                    <span>Shipping Information</span>
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Street address, apartment, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="font-semibold flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    <span>Payment Method</span>
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-cash"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="payment-cash" className="text-gray-700">Cash on Delivery</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="payment-card" className="text-gray-700">Debit / Credit Card</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-bkash"
                        name="paymentMethod"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="payment-bkash" className="text-gray-700">bKash</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-nagad"
                        name="paymentMethod"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="payment-nagad" className="text-gray-700">Nagad</label>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-center">
                        Card payment functionality will be available soon.
                      </p>
                    </div>
                  )}
                  
                  {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-center">
                        Mobile payment functionality will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex items-center py-3 border-b">
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">৳{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{cart.totalPrice}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success-500">Free</span>
                </div>
                
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">৳{cart.totalPrice}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                By placing your order, you agree to our terms and conditions and privacy policy.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CheckoutPage;