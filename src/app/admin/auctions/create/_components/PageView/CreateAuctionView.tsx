import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { AuctionStatus } from "@/types";
import Link from "next/link";
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">オークション作成</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/auctions"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </Link>
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

      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">基本情報</h3>
            <p className="mt-1 text-sm text-gray-500">オークションの基本情報を入力してください。</p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                オークション名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="春のオークション"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">オークションの詳細な説明を入力してください。</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 mb-1">
                開始日時 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startAt"
                name="startAt"
                value={formData.startAt}
                onChange={handleDateInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 mb-1">
                終了日時 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="endAt"
                name="endAt"
                value={formData.endAt}
                onChange={handleDateInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="paymentDeadlineAt" className="block text-sm font-medium text-gray-700 mb-1">
                支払期限 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="paymentDeadlineAt"
                name="paymentDeadlineAt"
                value={formData.paymentDeadlineAt}
                onChange={handleDateInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={AuctionStatus.DRAFT}>下書き</option>
                <option value={AuctionStatus.ACTIVE}>開催中</option>
                <option value={AuctionStatus.FINISHED}>終了</option>
                <option value={AuctionStatus.CANCELLED}>キャンセル</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {productLoading ? (
            <Loading />
          ) : (
            <div className="sm:col-span-4">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                商品 <span className="text-red-500">*</span>
              </label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleProductChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">選択してください</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ¥{product.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">オークション設定</h3>
            <p className="mt-1 text-sm text-gray-500">オークションの設定オプションを選択してください。</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isSealed"
                  name="isSealed"
                  type="checkbox"
                  checked={formData.isSealed}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="needPaymentInfo" className="font-medium text-gray-700">
                  支払い情報必須
                </label>
                <p className="text-gray-500">入札前に支払い情報の登録を必須にします。最初の頃はOFFにする</p>
              </div>
            </div>
          </div>
        </div>

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
                <h3 className="text-sm font-medium text-green-800">オークションが正常に作成されました</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>オークション一覧ページにリダイレクトします...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-end gap-4">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Link
                  href="/admin/auctions"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  キャンセル
                </Link>
                <Button label="保存する" type="submit" color="blue" />
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAuctionView;
