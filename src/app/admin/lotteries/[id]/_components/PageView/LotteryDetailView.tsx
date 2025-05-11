"use client";

import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import { useState } from "react";
import type { LotteryDetailLogic } from "../../page";

const LotteryDetailView = ({ lottery, products, loading, error, getStatusBadge }: LotteryDetailLogic) => {
  const [activeTab, setActiveTab] = useState<"info" | "products" | "entries">("info");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-red-800 font-semibold text-lg">エラーが発生しました</h2>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <Link href="/admin/lotteries" className="text-blue-600 hover:underline flex items-center">
            抽選一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-medium text-gray-700">抽選情報が見つかりませんでした。</h2>
        <div className="mt-4">
          <Link href="/admin/lotteries" className="text-blue-600 hover:underline inline-flex items-center">
            抽選一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "info"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          基本情報
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "products"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          商品一覧
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("entries")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "entries"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          応募状況
        </button>
      </nav>
    </div>
  );

  const renderInfoTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">基本情報</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">ステータス</span>
            <div>{getStatusBadge(lottery.status)}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">開始日時</span>
            <span className="text-gray-800">{formatDate(lottery.start_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">終了日時</span>
            <span className="text-gray-800">{formatDate(lottery.end_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">当選結果発表</span>
            <span className="text-gray-800">{formatDate(lottery.result_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">支払期限</span>
            <span className="text-gray-800">{formatDate(lottery.payment_deadline_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">作成日時</span>
            <span className="text-gray-800">{formatDate(lottery.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {lottery.description || "説明はありません。"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">商品一覧</h2>
      {products && products.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品画像
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <img src={product.image} alt={product.name} className="object-cover h-16 w-16 rounded-md" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ¥{product.price?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium">商品はありません。</p>
        </div>
      )}
    </div>
  );

  const renderEntriesTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">応募状況</h2>
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <p className="text-gray-600 font-medium">この機能は現在開発中です。</p>
        <p className="text-gray-500 text-sm mt-2">今後のアップデートでご利用いただけるようになります。</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mr-3">{lottery.name}</h1>
              {getStatusBadge(lottery.status)}
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {lottery.id}</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outlined" color="gray">
              <Link href="/admin/lotteries">戻る</Link>
            </Button>
            <Button variant="outlined">
              <Link href={`/admin/lotteries/${lottery.id}/edit`}>編集</Link>
            </Button>
          </div>
        </div>
      </div>

      {renderTabs()}

      <div className="mb-8">
        {activeTab === "info" && renderInfoTab()}
        {activeTab === "products" && renderProductsTab()}
        {activeTab === "entries" && renderEntriesTab()}
      </div>
    </div>
  );
};

export default LotteryDetailView;
