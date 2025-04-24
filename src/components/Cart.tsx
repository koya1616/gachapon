import type { Product } from "@/types";
import { memo } from "react";
import { useTranslation as t } from "@/lib/translations";
import type { Lang } from "@/types";

interface CartProps {
  isOpen: boolean;
  cart: Product[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  lang: Lang;
}

interface CartItemProps {
  item: Product;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
  lang: Lang;
}

const CartItem = memo(function CartItem({ item, onUpdateQuantity, onRemove, lang }: CartItemProps) {
  const isMaxQuantity = item.quantity >= item.stock_quantity;

  return (
    <div className="flex items-center justify-between border-b pb-4">
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
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 border rounded-l cursor-pointer"
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isMaxQuantity}
          className={`px-2 py-1 border rounded-r ${
            isMaxQuantity ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
        >
          {t(lang).cart.remove}
        </button>
      </div>
    </div>
  );
});

export default function Cart({
  isOpen,
  cart,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
}: CartProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-20 flex justify-center items-start pt-20 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t(lang).cart.title}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center py-8 text-gray-500">{t(lang).cart.empty}</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  lang={lang}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{t(lang).cart.total}</span>
                <span className="font-bold text-xl">¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {t(lang).cart.clear_cart}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                  // TODO: stock_quantityの数を確認。確認する方法は二段階
                  // 1. sessionStorageで確認
                  // 2. DBで確認
                  // 3. 問題なければstock_quantityを減らす
                >
                  {t(lang).cart.checkout}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
