"use client";

import { memo } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useTranslation as t } from "@/lib/translations";
import type { Lang } from "@/types";

const ProductCard = memo(function ProductCard({ product, lang }: { product: Product; lang: Lang }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pt-[100%]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="text-gray-900">{product.name}</h3>
        <p className="font-bold text-blue-700 text-right">¥ {product.price.toLocaleString()}</p>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
        >
          {t(lang).product.addToCart}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
