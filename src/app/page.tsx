import Products from "@/components/Products";
import { getProducts } from "@/lib/db";

export default async function Home() {
  const products = await getProducts();
  return <Products products={products} />;
}
