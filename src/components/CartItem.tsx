import type { Product } from "../types";

interface CartItemProps {
  item: Product;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
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
          className="px-2 py-1 border rounded-r cursor-pointer"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
        >
          削除
        </button>
      </div>
    </div>
  );
}
