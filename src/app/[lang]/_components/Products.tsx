import type { Product } from "@/types";
import ProductCard from "@/app/[lang]/_components/ProductCard";
import Link from "next/link";
import type { Lang } from "@/types";
import { useTranslation as t } from "@/lib/translations";

const Products = ({ products, lang }: { products: Product[]; lang: Lang }) => {
  return (
    <div className="w-[90%] mx-auto mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
      <div className="text-center mt-6">
        <Link
          href={`/${lang}/checkout`}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
        >
          {t(lang).product.to_payment}
        </Link>
      </div>
    </div>
  );
};

export default Products;
