"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  const products: Product[] = [
    {
      id: 1,
      name: "エコノミー機内食",
      price: 24900,
      image: "image1.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
      quantity: 1,
    },
    {
      id: 3,
      name: "エコノミー機内食",
      price: 34500,
      image: "image1.jpg",
      quantity: 1,
    },
    {
      id: 4,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
      quantity: 1,
    },
    {
      id: 5,
      name: "エコノミー機内食",
      price: 5400,
      image: "image1.jpg",
      quantity: 1,
    },
    {
      id: 6,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
      quantity: 1,
    },
    {
      id: 7,
      name: "エコノミー機内食",
      price: 6500,
      image: "image1.jpg",
      quantity: 1,
    },
    {
      id: 8,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
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

  return (
    <>
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between h-16 w-[90%] mx-auto mt-4 mb-2">
          <div className="flex items-center">
            <Image src="/logo.jpg" alt="Logo" width={56} height={56} className="rounded-full" />
            <div className="ml-2 text-xl font-semibold">gasyaponpon</div>
          </div>
          <div className="py-4 flex justify-end items-center">
            <button type="button" className="cursor-pointer" onClick={() => setIsCartOpen(!isCartOpen)}>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="h-4 transition-all ease-in-out hover:scale-110"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                {cart.length > 0 && (
                  <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
      <div className="w-[90%] mx-auto">
        {isCartOpen && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-20 flex justify-center items-start pt-20 pointer-events-auto">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">カート</h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center py-8 text-gray-500">カートは空です</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 relative mr-4">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-blue-700">¥{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border rounded-l cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border rounded-r cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">合計:</span>
                      <span className="font-bold text-xl">¥{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={clearCart}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        カートを空にする
                      </button>
                      <button
                        type="button"
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        購入手続きへ
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative pt-[100%]">
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 mb-2">{product.name}</h3>
                <p className="font-bold text-blue-700 text-right">¥ {product.price}</p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                >
                  カートに追加
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
