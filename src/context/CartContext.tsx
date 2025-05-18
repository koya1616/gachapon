"use client";

import { CART } from "@/const/sessionStorage";
import type { Product } from "@/types";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface CartContextType {
  cart: Product[];
  isCartOpen: boolean;
  totalPrice: number;
  add_to_cart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clear_cart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = sessionStorage.getItem(CART);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (_e) {
        setCart([]);
        sessionStorage.removeItem(CART);
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      sessionStorage.setItem(CART, JSON.stringify(cart));
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  const add_to_cart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: number, newQuantity: number) => {
      if (newQuantity < 0) return;
      if (newQuantity === 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
      );
    },
    [removeFromCart],
  );

  const clear_cart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const contextValue = useMemo(
    () => ({
      cart,
      isCartOpen,
      totalPrice,
      add_to_cart,
      removeFromCart,
      updateQuantity,
      clear_cart,
      toggleCart,
      closeCart,
    }),
    [cart, isCartOpen, totalPrice, add_to_cart, removeFromCart, updateQuantity, clear_cart, toggleCart, closeCart],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
