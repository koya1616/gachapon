import Alert from "@/components/Alert";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { AuctionDetailLogic } from "../../page";

const AuctionDetailView = ({
  auction,
  product,
  bids,
  loading,
  error,
  getStatusBadge,
  tabs,
  activeTab,
  setActiveTab,
}: AuctionDetailLogic) => {
  if (loading) {
    return <Loading />;
  }

  if (error) return <Alert text={error} type="error" />;

  if (!auction) return <Alert text="オークションが見つかりません" type="error" />;

  const renderTabs = () => <Tab items={tabs} activeTab={activeTab} onClick={(name) => setActiveTab(name)} />;

  const renderInfoTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">基本情報</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">ステータス</span>
            <div>{getStatusBadge(auction.status)}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">オークション方式</span>
            <span className="text-gray-800">{auction.is_sealed ? "封印入札" : "公開入札"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">入札取り消し</span>
            <span className="text-gray-800">{auction.allow_bid_retraction ? "許可" : "不許可"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">支払い情報入力</span>
            <span className="text-gray-800">{auction.need_payment_info ? "必要" : "不要"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">最低入札額</span>
            <span className="text-gray-800">¥{auction.minimum_bid.toLocaleString()}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">開始日時</span>
            <span className="text-gray-800">{formatDate(auction.start_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">終了日時</span>
            <span className="text-gray-800">{formatDate(auction.end_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">支払期限</span>
            <span className="text-gray-800">{formatDate(auction.payment_deadline_at)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">作成日時</span>
            <span className="text-gray-800">{formatDate(auction.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">商品情報</h2>
        {product ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">商品ID</span>
              <span className="text-gray-800">{product.id}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">商品名</span>
              <span className="text-gray-800">{product.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">価格</span>
              <span className="text-gray-800">¥{product.price.toLocaleString()}</span>
            </div>
            {product.image && (
              <div className="py-2">
                <div className="text-gray-600 font-medium mb-2">商品画像</div>
                <div className="flex justify-center">
                  <img src={product.image} alt={product.name} className="object-cover h-48 w-auto rounded-md" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">商品情報が見つかりません</p>
          </div>
        )}
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {auction.description || "説明はありません。"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderBidsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">入札状況</h2>
      <div>
        {bids && bids.length > 0 ? (
          <Table
            data={bids}
            keyExtractor={(bid) => bid.id}
            columns={[
              {
                header: "入札ID",
                accessor: "id",
              },
              {
                header: "ユーザーID",
                accessor: "user_id",
              },
              {
                header: "入札額",
                accessor: (bid) => `¥${bid.amount.toLocaleString()}`,
              },
              {
                header: "入札日時",
                accessor: (bid) => formatDate(bid.created_at),
              },
            ]}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">入札はありません。</p>
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mr-3">{auction.name}</h1>
              {getStatusBadge(auction.status)}
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {auction.id}</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outlined" color="gray">
              <Link href="/admin/auctions">戻る</Link>
            </Button>
            <Button variant="outlined">
              <Link href={`/admin/auctions/${auction.id}/edit`}>編集</Link>
            </Button>
          </div>
        </div>
      </div>

      {renderTabs()}

      <div className="mb-8">
        {activeTab === "基本情報" && renderInfoTab()}
        {activeTab === "入札状況" && renderBidsTab()}
      </div>
    </div>
  );
};

export default AuctionDetailView;
