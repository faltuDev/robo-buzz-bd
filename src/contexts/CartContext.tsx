import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, set, get, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from './AuthContext';
import { Cart, CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const defaultCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const { currentUser } = useAuth();

  // Sync cart with Firebase when user is logged in
  useEffect(() => {
    let unsubscribe: () => void;
    
    if (currentUser) {
      const cartRef = ref(database, `carts/${currentUser.uid}`);
      
      unsubscribe = onValue(cartRef, async (snapshot) => {
        if (snapshot.exists()) {
          const cartData = snapshot.val();
          
          // Fetch product details for each cart item
          const cartItemsWithDetails = await Promise.all(
            Object.values(cartData.items || {}).map(async (item: any) => {
              const productRef = ref(database, `products/${item.productId}`);
              const productSnapshot = await get(productRef);
              
              if (productSnapshot.exists()) {
                return {
                  ...item,
                  product: productSnapshot.val() as Product
                };
              }
              return null;
            })
          );
          
          // Filter out null values (products that no longer exist)
          const validItems = cartItemsWithDetails.filter(Boolean) as CartItem[];
          
          // Calculate totals
          const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          
          setCart({
            items: validItems,
            totalItems,
            totalPrice
          });
        } else {
          // If no cart exists yet, set default empty cart
          setCart(defaultCart);
        }
      });
    } else {
      // If user logs out, reset to default cart
      setCart(defaultCart);
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Add product to cart
  async function addToCart(product: Product, quantity = 1) {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
      let newItems = [...cart.items];
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems.push({
          productId: product.id,
          quantity,
          product
        });
      }
      
      // Calculate new totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const newCart = {
        items: newItems,
        totalItems,
        totalPrice
      };
      
      // Update cart in database
      await set(ref(database, `carts/${currentUser.uid}`), {
        items: newItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        updatedAt: new Date().toISOString()
      });
      
      setCart(newCart);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }

  // Remove product from cart
  async function removeFromCart(productId: string) {
    if (!currentUser) return;
    
    try {
      const newItems = cart.items.filter(item => item.productId !== productId);
      
      // Calculate new totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const newCart = {
        items: newItems,
        totalItems,
        totalPrice
      };
      
      // Update cart in database
      await set(ref(database, `carts/${currentUser.uid}`), {
        items: newItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        updatedAt: new Date().toISOString()
      });
      
      setCart(newCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  }

  // Update quantity of a product in cart
  async function updateQuantity(productId: string, quantity: number) {
    if (!currentUser || quantity < 1) return;
    
    try {
      const newItems = cart.items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      
      // Calculate new totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const newCart = {
        items: newItems,
        totalItems,
        totalPrice
      };
      
      // Update cart in database
      await set(ref(database, `carts/${currentUser.uid}`), {
        items: newItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        updatedAt: new Date().toISOString()
      });
      
      setCart(newCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  }

  // Clear entire cart
  async function clearCart() {
    if (!currentUser) return;
    
    try {
      // Remove cart from database
      await set(ref(database, `carts/${currentUser.uid}`), null);
      
      setCart(defaultCart);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}