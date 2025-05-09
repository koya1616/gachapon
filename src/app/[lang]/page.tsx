import Products from "@/app/[lang]/_components/Products";
import { getProducts } from "@/lib/db";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const products = await getProducts();
  return <Products products={products} lang={lang === "en" ? "en" : lang === "zh" ? "zh" : "ja"} />;
}
