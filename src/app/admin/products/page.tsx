"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError("商品データの取得に失敗しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">商品一覧</h1>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">商品一覧</h1>
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <div className="flex justify-end mb-6">
          <Link href="/admin/upload" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            商品を追加
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">商品一覧</h1>

      <div className="flex justify-end mb-6">
        <Link href="/admin/upload" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          商品を追加
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">商品画像</th>
              <th className="py-2 px-4 border-b text-left">商品名</th>
              <th className="py-2 px-4 border-b text-left">価格</th>
              <th className="py-2 px-4 border-b text-left">在庫数</th>
              <th className="py-2 px-4 border-b text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">¥{product.price.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{product.stock_quantity}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-500 hover:text-blue-700 mr-3">
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  商品が登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
