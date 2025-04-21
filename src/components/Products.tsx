import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import type { Lang } from "@/types";

export default function Products({ products, lang }: { products: Product[]; lang: Lang }) {
  return (
    <div className="w-[90%] mx-auto mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </div>
  );
}
