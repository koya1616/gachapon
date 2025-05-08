"use client";

import { memo } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useTranslation as t } from "@/lib/translations";
import type { Lang } from "@/types";

interface ProductCardLogic {
  add_to_cart: (product: Product) => void;
  isMaxQuantity: boolean;
}

export const ProductCardView = ({ product, lang, add_to_cart, isMaxQuantity }: ProductCardLogic & ProductCardProps) => {
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
          onClick={() => add_to_cart(product)}
          disabled={isMaxQuantity}
          className={`mt-3 w-full py-2 rounded-md transition-colors duration-300 ${
            isMaxQuantity ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {isMaxQuantity ? t(lang).product.out_of_stock : t(lang).product.add_to_cart}
        </button>
      </div>
    </div>
  );
};

const useProduct = (product: Product): ProductCardLogic => {
  const { add_to_cart, cart } = useCart();

  const currentInCart = cart.find((item) => item.id === product.id)?.quantity || 0;
  const isMaxQuantity = currentInCart >= product.stock_quantity;

  return { add_to_cart, isMaxQuantity };
};

type ProductCardProps = { product: Product; lang: Lang };
const ProductCard = memo(({ product, lang }: ProductCardProps) => {
  return <ProductCardView product={product} lang={lang} {...useProduct(product)} />;
});

export default ProductCard;
