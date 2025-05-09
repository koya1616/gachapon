"use client";

import type { Product } from "@/types";
import { useEffect, useState } from "react";
import ProductsListView from "./_components/PageView";

export interface ProductsListLogic {
  products: Product[];
  loading: boolean;
}

const useProductsList = (): ProductsListLogic => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await fetch("/api/product");
      const { data: products }: { data: Product[] } = await response.json();
      setProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

const ProductsList = () => {
  return <ProductsListView {...useProductsList()} />;
};

export default ProductsList;
