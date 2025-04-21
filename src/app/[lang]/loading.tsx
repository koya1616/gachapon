import Products from "@/components/Products";

export default function Loading() {
  const products = Array(4)
    .fill({
      id: 0,
      name: "",
      price: 0,
      image: "product-loading.png",
      quantity: 1,
    })
    .map((product, index) => ({
      ...product,
      id: index + 1,
    }));
  return <Products products={products} lang={"en"} />;
}
