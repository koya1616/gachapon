"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LotteryStatus, type Product } from "@/types";

export default function CreateLotteryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; productId: number; quantity: number }>>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startAt: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    endAt: formatDateForInput(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
    resultAt: formatDateForInput(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    paymentDeadlineAt: formatDateForInput(new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)),
    status: LotteryStatus.DRAFT,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const response = await fetch("/api/product");
      if (!response.ok) throw new Error("商品の取得に失敗しました");

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setProductLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "status" ? Number.parseInt(value) : value,
    });
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { id: crypto.randomUUID(), productId: 0, quantity: 1 }]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleProductChange = (index: number, field: string, value: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("抽選名を入力してください");
      }

      const startDate = new Date(formData.startAt);
      const endDate = new Date(formData.endAt);
      const resultDate = new Date(formData.resultAt);
      const paymentDeadlineDate = new Date(formData.paymentDeadlineAt);

      if (startDate >= endDate) {
        throw new Error("開始日時は終了日時より前である必要があります");
      }

      if (endDate >= resultDate) {
        throw new Error("終了日時は結果発表日時より前である必要があります");
      }

      if (resultDate >= paymentDeadlineDate) {
        throw new Error("結果発表日時は支払期限より前である必要があります");
      }

      if (selectedProducts.length === 0) {
        throw new Error("少なくとも1つの商品を選択してください");
      }

      for (const product of selectedProducts) {
        if (product.productId === 0) {
          throw new Error("すべての商品を選択してください");
        }
        if (product.quantity <= 0) {
          throw new Error("商品の数量は1以上である必要があります");
        }
      }

      const apiData = {
        ...formData,
        startAt: new Date(formData.startAt).getTime(),
        endAt: new Date(formData.endAt).getTime(),
        resultAt: new Date(formData.resultAt).getTime(),
        paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
        products: selectedProducts.map(({ productId, quantity }) => ({ productId, quantity })),
      };

      const response = await fetch("/api/lottery/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "抽選の作成に失敗しました");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/lotteries");
      }, 2000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">抽選イベント作成</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/lotteries"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">基本情報</h3>
            <p className="mt-1 text-sm text-gray-500">抽選イベントの基本情報を入力してください。</p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                抽選名 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  required
                  placeholder="春のパン祭り"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">抽選の詳細な説明を入力してください。</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">
                開始日時 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  id="startAt"
                  name="startAt"
                  value={formData.startAt}
                  onChange={handleDateInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endAt" className="block text-sm font-medium text-gray-700">
                終了日時 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  id="endAt"
                  name="endAt"
                  value={formData.endAt}
                  onChange={handleDateInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="resultAt" className="block text-sm font-medium text-gray-700">
                結果発表日時 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  id="resultAt"
                  name="resultAt"
                  value={formData.resultAt}
                  onChange={handleDateInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="paymentDeadlineAt" className="block text-sm font-medium text-gray-700">
                支払期限 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  id="paymentDeadlineAt"
                  name="paymentDeadlineAt"
                  value={formData.paymentDeadlineAt}
                  onChange={handleDateInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                ステータス <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                >
                  <option value={LotteryStatus.DRAFT}>下書き</option>
                  <option value={LotteryStatus.ACTIVE}>完成</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">抽選商品</h3>
            <p className="mt-1 text-sm text-gray-500">抽選に含める商品を選択してください。</p>
          </div>

          {productLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="mt-6">
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-full sm:w-1/2">
                    <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      商品 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`product-${index}`}
                      value={product.productId}
                      onChange={(e) => handleProductChange(index, "productId", Number.parseInt(e.target.value))}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    >
                      <option value={0}>商品を選択してください</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ¥{p.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/4">
                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", Number.parseInt(e.target.value))}
                      min="1"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div className="w-full sm:w-1/4 flex items-end justify-end mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                    >
                      <svg
                        className="-ml-0.5 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Minus</title>
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      削除
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddProduct}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Plus</title>
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                商品を追加
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">抽選イベントが正常に作成されました</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>抽選一覧ページにリダイレクトします...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              href="/admin/lotteries"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              }`}
            >
              {loading ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
