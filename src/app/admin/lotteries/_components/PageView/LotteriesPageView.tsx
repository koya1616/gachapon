import Loading from "@/components/Loading";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { LotteriesPageLogic } from "../../page";

const LotteriesPageView = ({ lotteries, loading, getStatusBadge }: LotteriesPageLogic) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="h-10 w-1 bg-blue-600 rounded-full mr-3 hidden sm:block" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">抽選管理</h2>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/auctions/create"
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              新規作成
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {lotteries.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          名称
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          開始日時
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          終了日時
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          結果発表
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          支払期限
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ステータス
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">編集</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lotteries.map((lottery) => (
                        <tr key={lottery.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lottery.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(lottery.start_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(lottery.end_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(lottery.result_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(lottery.payment_deadline_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(lottery.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin/lotteries/${lottery.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              詳細
                            </Link>
                            <Link
                              href={`/admin/lotteries/${lottery.id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              編集
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-16 sm:px-6 text-center">
                      <p className="text-gray-500">抽選イベントはまだ作成されていません</p>
                      <div className="mt-5">
                        <Link
                          href="/admin/lotteries/create"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          抽選イベント作成
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteriesPageView;
