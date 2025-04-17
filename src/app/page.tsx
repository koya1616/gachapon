"use client"
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

  // カートの初期化 (localStorage から読み込み)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]);
      }
    }
  }, []);

  // カートの変更を localStorage に保存
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // 合計金額の計算
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  // カートに商品を追加する関数
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // すでにカートに存在するか確認
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // 既存のアイテムの数量を増やす
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // カートから商品を削除する関数
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);

      // カートが空になった場合は localStorage から削除
      if (newCart.length === 0) {
        localStorage.removeItem("cart");
      }

      return newCart;
    });
  };

  // 商品の数量を変更する関数
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
  };

  // カートを空にする関数
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="w-[90%] mx-auto">
      {/* カートボタン */}
      <div className="sticky top-0 z-10 bg-white py-4 flex justify-end items-center">
        <button
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          カート ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      {/* カートのモーダル */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-start pt-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">ショッピングカート</h2>
              <button type="button" onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
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
                          className="px-2 py-1 border rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
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
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      カートを空にする
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
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
  );
}
