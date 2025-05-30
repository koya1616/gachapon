import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { LotteryDetailLogic } from "../../page";

const LotteryDetailView = ({
  lottery,
  products,
  entries,
  loading,
  error,
  getStatusBadge,
  getEntryResultBadge,
  tabs,
  activeTab,
  setActiveTab,
}: LotteryDetailLogic) => {
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

  const renderTabs = () => <Tab items={tabs} activeTab={activeTab} onClick={(name) => setActiveTab(name)} />;

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
        <Table
          data={products}
          keyExtractor={(product) => product.id}
          columns={[
            {
              header: "商品ID",
              accessor: "id",
            },
            {
              header: "商品名",
              accessor: "name",
            },
            {
              header: "商品画像",
              accessor: (product) => (
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <img src={product.image} alt={product.name} className="object-cover h-16 w-16 rounded-md" />
                </div>
              ),
            },
            {
              header: "価格",
              accessor: (product) => `¥${product.price?.toLocaleString()}`,
            },
          ]}
        />
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
      <div>
        {entries?.length > 0 ? (
          <Table
            data={entries}
            keyExtractor={(entry) => entry.id}
            columns={[
              {
                header: "応募ID",
                accessor: "id",
              },
              {
                header: "ユーザーID",
                accessor: "user_id",
              },
              {
                header: "商品ID",
                accessor: "product_id",
              },
              {
                header: "結果",
                accessor: (entry) => getEntryResultBadge(entry.result),
              },
            ]}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">応募はありません。</p>
          </div>
        )}
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
        {activeTab === "基本情報" && renderInfoTab()}
        {activeTab === "商品一覧" && renderProductsTab()}
        {activeTab === "応募状況" && renderEntriesTab()}
      </div>
    </div>
  );
};

export default LotteryDetailView;
