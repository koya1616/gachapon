import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pt-[100%]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 mb-2">{product.name}</h3>
        <p className="font-bold text-blue-700 text-right">¥ {product.price.toLocaleString()}</p>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
        >
          カートに追加
        </button>
      </div>
    </div>
  );
}
