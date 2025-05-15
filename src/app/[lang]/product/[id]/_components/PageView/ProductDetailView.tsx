import type { Lang, Product } from "@/types";
import React from "react";
import "client-only";
import Alert from "@/components/Alert";
import { useTranslation as t } from "@/lib/translations";

export const ProductDetailView = ({
  product,
  lang,
}: {
  product: Product | null;
  lang: Lang;
}) => {
  if (!product) return <Alert text={t(lang).product.no_products} type="error" />;

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <figure className="overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square transform hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
        </figure>

        <header className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{product.name}</h1>
        </header>
      </div>
    </main>
  );
};

export default ProductDetailView;
