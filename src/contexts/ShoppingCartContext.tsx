
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '@/services/ShoppingService';

interface ShoppingCartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addToCart = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      // Check if product is already in cart
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity
        return currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...currentItems, { id: product.id, product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.product.id !== productId)
    );
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  };
  
  const value = {
    items,
    itemCount: items.length,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice
  };
  
  return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>;
};
