import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
} from 'lucide-react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Product } from '../types';

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export const CartPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // helper to recalc totals
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.quantity * i.product.price,
    0
  );

  // load cart from Firebase
  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const cartRef = ref(database, `carts/${currentUser.uid}`);
    const unsubscribe = onValue(cartRef, async (snap) => {
      if (!snap.exists()) {
        setItems([]);
        setLoading(false);
        return;
      }
      const data = snap.val();
      const rawItems: { productId: string; quantity: number }[] =
        Array.isArray(data.items)
          ? data.items.filter(Boolean)
          : Object.values(data.items || {});
      // fetch each product
      const withDetails = await Promise.all(
        rawItems.map(async (i) => {
          const pSnap = await get(
            ref(database, `products/${i.productId}`)
          );
          if (!pSnap.exists()) return null;
          return {
            ...i,
            product: pSnap.val() as Product,
          };
        })
      );
      setItems(withDetails.filter((x) => x) as CartItem[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // write back helper
  const writeCart = async (newItems: CartItem[]) => {
    if (!currentUser) return;
    // only store productId + quantity
    const payload = newItems.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));
    await set(ref(database, `carts/${currentUser.uid}`), {
      items: payload,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateQuantity = async (id: string, qty: number) => {
    const idx = items.findIndex((i) => i.productId === id);
    if (idx < 0 || qty < 1 || qty > items[idx].product.stock) return;
    const next = [...items];
    next[idx] = { ...next[idx], quantity: qty };
    setItems(next);
    await writeCart(next);
  };

  const removeItem = async (id: string) => {
    const next = items.filter((i) => i.productId !== id);
    setItems(next);
    await writeCart(next);
    toast.success('Removed from cart');
  };

  const clearCart = async () => {
    setItems([]);
    await set(ref(database, `carts/${currentUser?.uid}`), null);
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/auth', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500" />
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
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600"
        >
          <ChevronLeft size={20} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </h2>
                <button
                  onClick={clearCart}
                  className="text-error-500 text-sm flex items-center hover:underline"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear Cart
                </button>
              </div>
              <div className="divide-y">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 flex items-center"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/products/${item.productId}`}
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
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-semibold">
                        ৳{item.product.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
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

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-lg mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success-500">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>৳{totalPrice}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="btn-primary w-full flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                Proceed to Checkout
              </button>
              <p className="mt-4 text-xs text-gray-500 text-center">
                By proceeding to checkout, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products yet.
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
