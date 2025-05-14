import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import type { ProductDetailLogic } from "../../page";

const ProductDetailView = ({
  product,
  lotteryEvents,
  auctions,
  loading,
  error,
  isEditing,
  editForm,
  updateStatus,
  handleInputChange,
  handleSubmit,
  setIsEditing,
}: ProductDetailLogic) => {
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
        {!isEditing && <Button label="編集" onClick={() => setIsEditing(true)} />}
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
              <Button label="キャンセル" onClick={() => setIsEditing(false)} color="gray" />
              {updateStatus.loading ? <Loading /> : <Button label="更新する" type="submit" />}
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
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
          {lotteryEvents.length > 0 &&
            lotteryEvents.map((lotteryEvent) => (
              <div key={lotteryEvent.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">抽選イベント情報</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-gray-600 text-sm">イベント名</h3>
                        <p className="font-medium">{lotteryEvent.name}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">イベントID</h3>
                        <p className="font-medium">{lotteryEvent.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-gray-600 text-sm">開始日時</h3>
                        <p className="font-medium">{formatDate(lotteryEvent.start_at)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">終了日時</h3>
                        <p className="font-medium">{formatDate(lotteryEvent.end_at)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">結果発表日時</h3>
                        <p className="font-medium">{formatDate(lotteryEvent.result_at)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">支払期限</h3>
                        <p className="font-medium">{formatDate(lotteryEvent.payment_deadline_at)}</p>
                      </div>
                    </div>

                    {lotteryEvent.description && (
                      <div>
                        <h3 className="text-gray-600 text-sm">説明</h3>
                        <p className="whitespace-pre-wrap">{lotteryEvent.description}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <Link href={`/admin/lotteries/${lotteryEvent.id}`} className="text-blue-500 hover:text-blue-700">
                        抽選イベントの詳細を見る →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {auctions.length > 0 &&
            auctions.map((auction) => (
              <div key={auction.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">オークション情報</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-gray-600 text-sm">オークション名</h3>
                        <p className="font-medium">{auction.name}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">オークションID</h3>
                        <p className="font-medium">{auction.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-gray-600 text-sm">開始日時</h3>
                        <p className="font-medium">{formatDate(auction.start_at)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">終了日時</h3>
                        <p className="font-medium">{formatDate(auction.end_at)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-600 text-sm">支払期限</h3>
                        <p className="font-medium">{formatDate(auction.payment_deadline_at)}</p>
                      </div>
                    </div>

                    {auction.description && (
                      <div>
                        <h3 className="text-gray-600 text-sm">説明</h3>
                        <p className="whitespace-pre-wrap">{auction.description}</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link href={`/admin/auctions/${auction.id}`} className="text-blue-500 hover:text-blue-700">
                        オークションの詳細を見る →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;
