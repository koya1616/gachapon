import Products from "@/components/Products";

export default function Loading() {
  const products = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    name: "",
    price: 0,
    image: "product-loading.png",
    quantity: 1,
  }));

  return <Products products={products} lang="en" />;
}
