"use client";

import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";
import { useTranslation as t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Lang } from "@/types";
import { memo } from "react";

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
        <Button
          label={isMaxQuantity ? t(lang).product.out_of_stock : t(lang).product.add_to_cart}
          disabled={isMaxQuantity}
          onClick={() => add_to_cart(product)}
          width="w-full"
          color={isMaxQuantity ? "gray" : "blue"}
        />
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
