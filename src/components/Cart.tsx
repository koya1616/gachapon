import type { Product } from "@/types";
import CartItem from "./CartItem";

interface CartProps {
  isOpen: boolean;
  cart: Product[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export default function Cart({
  isOpen,
  cart,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-20 flex justify-center items-start pt-20 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">カート</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center py-8 text-gray-500">カートは空です</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
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
                  onClick={onClearCart}
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
  );
}
