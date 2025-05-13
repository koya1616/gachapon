import Loading from "@/components/Loading";
import { AuctionStatus } from "@/types";
import type { CreateAuctionLogic } from "../../page";

const CreateAuctionView = ({
  formData,
  products,
  loading,
  productLoading,
  error,
  success,
  handleInputChange,
  handleDateInputChange,
  handleCheckboxChange,
  handleProductChange,
  handleSubmit,
}: CreateAuctionLogic) => {
  if (success) {
    return (
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
            <h3 className="text-sm font-medium text-green-800">オークションが正常に作成されました</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>オークション一覧ページにリダイレクトします...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center">
          <div className="h-10 w-1 bg-blue-600 rounded-full mr-3 hidden sm:block" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">オークション作成</h2>
        </div>
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

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  オークション名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  ステータス <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={AuctionStatus.DRAFT}>下書き</option>
                  <option value={AuctionStatus.ACTIVE}>開催中</option>
                  <option value={AuctionStatus.FINISHED}>終了</option>
                  <option value={AuctionStatus.CANCELLED}>キャンセル</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">日程</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">
                  開始日時 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startAt"
                  id="startAt"
                  required
                  value={formData.startAt}
                  onChange={handleDateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endAt" className="block text-sm font-medium text-gray-700">
                  終了日時 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endAt"
                  id="endAt"
                  required
                  value={formData.endAt}
                  onChange={handleDateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="paymentDeadlineAt" className="block text-sm font-medium text-gray-700">
                  支払期限 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="paymentDeadlineAt"
                  id="paymentDeadlineAt"
                  required
                  value={formData.paymentDeadlineAt}
                  onChange={handleDateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">商品選択</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                  商品 <span className="text-red-500">*</span>
                </label>
                {productLoading ? (
                  <Loading />
                ) : (
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="0">選択してください</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ¥{product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">オークション設定</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isSealed"
                    name="isSealed"
                    type="checkbox"
                    checked={formData.isSealed}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isSealed" className="font-medium text-gray-700">
                    封印入札
                  </label>
                  <p className="text-gray-500">
                    各入札者が一度だけ秘密裏に入札額を提示し、最も高い価格を提示した人が落札する形式。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowBidRetraction"
                    name="allowBidRetraction"
                    type="checkbox"
                    checked={formData.allowBidRetraction}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowBidRetraction" className="font-medium text-gray-700">
                    入札取り消し許可
                  </label>
                  <p className="text-gray-500">ユーザーが入札を取り消せるようにします</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="needPaymentInfo"
                    name="needPaymentInfo"
                    type="checkbox"
                    checked={formData.needPaymentInfo}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="needPaymentInfo" className="font-medium text-gray-700">
                    支払い情報必須
                  </label>
                  <p className="text-gray-500">入札前に支払い情報の登録を必須にします。最初の頃ははOFFにする</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "作成中..." : "作成する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionView;
