"use client";
import { useState, useEffect } from "react";
import type { Product } from "../types";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";

export default function Home() {
  const products: Product[] = [
    {
      id: 1,
      name: "エコノミー機内食",
      price: 777,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/airline_food.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "おいしい給食",
      price: 1200,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/school_lunch.jpg",
      quantity: 1,
    },
    {
      id: 3,
      name: "定番お惣菜",
      price: 1000,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/teibann_osouzai.jpg",
      quantity: 1,
    },
    {
      id: 4,
      name: "魔女の宅急便",
      price: 10000,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/kikis_delivery_service.jpeg",
      quantity: 1,
    },
    {
      id: 5,
      name: "鳥貴族",
      price: 600,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/torikizoku.jpeg",
      quantity: 1,
    },
    {
      id: 6,
      name: "遠足の思い出",
      price: 300,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/bento_box_lunch.jpg",
      quantity: 1,
    },
    {
      id: 7,
      name: "無印良品",
      price: 400,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/muji.jpg",
      quantity: 1,
    },
    {
      id: 8,
      name: "アイスクリーム",
      price: 500,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/ice_cream.jpg",
      quantity: 1,
    },
  ];

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

        <ProductGrid products={products} onAddToCart={addToCart} />
      </div>
    </>
  );
}
