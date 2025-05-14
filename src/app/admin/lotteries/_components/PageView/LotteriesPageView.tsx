import Loading from "@/components/Loading";
import Table from "@/components/Table";
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
        <Table
          data={lotteries}
          keyExtractor={(lottery) => lottery.id}
          columns={[
            {
              header: "ID",
              accessor: "id",
            },
            {
              header: "名前",
              accessor: "name",
            },
            {
              header: "開始日時",
              accessor: (lottery) => formatDate(lottery.start_at),
            },
            {
              header: "終了日時",
              accessor: (lottery) => formatDate(lottery.end_at),
            },
            {
              header: "結果発表",
              accessor: (lottery) => formatDate(lottery.result_at),
            },
            {
              header: "支払期限",
              accessor: (lottery) => formatDate(lottery.payment_deadline_at),
            },
            {
              header: "ステータス",
              accessor: (lottery) => getStatusBadge(lottery.status),
            },
          ]}
        />
      )}
    </div>
  );
};

export default LotteriesPageView;
