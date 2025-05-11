"use client";

import Loading from "@/components/Loading";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { LotteryDetailLogic } from "../../page";

const LotteryDetailView = ({ lottery, products, loading, error, getStatusBadge }: LotteryDetailLogic) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-red-800 font-semibold">エラーが発生しました</h2>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <Link href="/admin/lotteries" className="text-blue-600 hover:underline">
            ← 抽選一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return <div>抽選情報が見つかりませんでした。</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{lottery.name}</h1>
        <div className="flex space-x-4">
          <Link href="/admin/lotteries" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            戻る
          </Link>
          <Link
            href={`/admin/lotteries/${lottery.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            編集
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">基本情報</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ステータス</span>
              <div>{getStatusBadge(lottery.status)}</div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">開始日時</span>
              <span>{formatDate(lottery.start_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">終了日時</span>
              <span>{formatDate(lottery.end_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">当選結果発表</span>
              <span>{formatDate(lottery.result_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支払期限</span>
              <span>{formatDate(lottery.payment_deadline_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">作成日時</span>
              <span>{formatDate(lottery.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">詳細説明</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{lottery.description || "説明はありません。"}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">商品一覧</h2>
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    価格
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">¥{product.price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">商品はありません。</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">応募状況</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">この機能は現在開発中です。</p>
        </div>
      </div>
    </div>
  );
};

export default LotteryDetailView;
