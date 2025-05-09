"use client";

import Loading from "@/components/Loading";
import type { Product } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock_quantity: "",
  });
  const [updateStatus, setUpdateStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchProductDetail = async () => {
      await fetch(`/api/product/${params.id}`)
        .then(async (res) => {
          const { data: product }: { data: Product } = await res.json();
          setProduct(product);
          setEditForm({
            name: product.name,
            price: String(product.price),
            stock_quantity: String(product.stock_quantity),
          });
        })
        .catch(() => {
          setError("商品詳細の取得に失敗しました。");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (params.id) {
      fetchProductDetail();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, error: null, success: false });

    const body: Partial<Product> = {
      name: editForm.name,
      price: Number(editForm.price),
      stock_quantity: Number(editForm.stock_quantity),
    };
    await fetch(`/api/product/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const { data: updatedProduct }: { data: Product } = await res.json();
        setProduct(updatedProduct);
        setIsEditing(false);
        setUpdateStatus({ loading: false, error: null, success: true });
      })
      .catch(() => {
        setUpdateStatus({
          loading: false,
          error: "商品情報の更新に失敗しました。",
          success: false,
        });
      });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/products" className="text-blue-500 hover:text-blue-700 mr-2">
            ← 商品一覧に戻る
          </Link>
        </div>
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/products" className="text-blue-500 hover:text-blue-700 mr-2">
            ← 商品一覧に戻る
          </Link>
        </div>
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error || "商品が見つかりませんでした。"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/products" className="text-blue-500 hover:text-blue-700">
          ← 商品一覧に戻る
        </Link>
        <div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2 cursor-pointer"
            >
              編集
            </button>
          )}
        </div>
      </div>

      {updateStatus.success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>商品情報が更新されました！</p>
          <p>商品更新まで時間がかかる場合があります。</p>
        </div>
      )}

      {updateStatus.error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{updateStatus.error}</p>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">商品情報を編集</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                商品名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                価格 (円)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stock_quantity" className="block text-gray-700 text-sm font-bold mb-2">
                在庫数
              </label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={editForm.stock_quantity}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md mr-2 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={updateStatus.loading}
                className={`py-2 px-4 rounded-md font-medium text-white ${
                  updateStatus.loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                }`}
              >
                {updateStatus.loading ? "更新中..." : "更新する"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-gray-600 text-sm">商品ID</h3>
                    <p className="font-medium">{product.id}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">価格</h3>
                    <p className="font-medium text-xl">¥{product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">在庫数</h3>
                    <p className="font-medium">{product.stock_quantity}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-600 text-sm mb-1">画像URL</h3>
                <p className="text-sm break-all">{product.image}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
