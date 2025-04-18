"use client";
import { useState, useEffect } from "react";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types";

export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);

      if (newCart.length === 0) {
        sessionStorage.removeItem("cart");
      }

      return newCart;
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem("cart");
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartItemCount={cartItemCount} onCartToggle={() => setIsCartOpen(!isCartOpen)} />

      <div className="w-[90%] mx-auto">
        <Cart
          isOpen={isCartOpen}
          cart={cart}
          totalPrice={totalPrice}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />

        <ProductGrid onAddToCart={addToCart} />
      </div>
    </>
  );
}
