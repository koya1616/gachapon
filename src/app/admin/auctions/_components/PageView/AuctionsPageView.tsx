import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import Table from "@/components/Table";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { AuctionsPageLogic } from "../../page";

const AuctionsPageView = ({ auctions, isLoading, error, getStatusBadge }: AuctionsPageLogic) => {
  if (error) return <Alert text={error} type="error" />;

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="h-10 w-1 bg-blue-600 rounded-full mr-3 hidden sm:block" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">オークション一覧</h2>
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

      {isLoading ? (
        <Loading />
      ) : auctions.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">オークションがありません</p>
        </div>
      ) : (
        <Table
          data={auctions}
          keyExtractor={(auction) => auction.id}
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
              header: "ステータス",
              accessor: (auction) => getStatusBadge(auction.status),
            },
            {
              header: "開始日時",
              accessor: (auction) => formatDate(auction.start_at),
            },
            {
              header: "終了日時",
              accessor: (auction) => formatDate(auction.end_at),
            },
            {
              header: "支払期限",
              accessor: (auction) => formatDate(auction.payment_deadline_at),
            },
            {
              header: "タイプ",
              accessor: (auction) => (auction.is_sealed ? "封印入札" : "公開増価"),
            },
            {
              header: "",
              accessor: (auction) => (
                <Link href={`/admin/auctions/${auction.id}`} className="text-blue-600 hover:text-blue-900">
                  詳細
                </Link>
              ),
            },
            {
              header: "",
              accessor: (auction) => (
                <Link href={`/admin/auctions/${auction.id}/edit`} className="text-blue-600 hover:text-blue-900">
                  編集
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default AuctionsPageView;
