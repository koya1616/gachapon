import Products from "@/components/Products";
import { getProducts } from "@/lib/db/index";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const products = await getProducts();
  return <Products products={products} lang={lang === "en" ? "en" : lang === "zh" ? "zh" : "ja"} />;
}
