import Alert from "@/components/Alert";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { LotteryStatus } from "@/types";
import Link from "next/link";
import type { CreateLotteryLogic } from "../../page";

const CreateLotteryView = ({
  formData,
  products,
  selectedProducts,
  loading,
  productLoading,
  error,
  success,
  handleInputChange,
  handleDateInputChange,
  handleAddProduct,
  handleRemoveProduct,
  handleProductChange,
  handleSubmit,
}: CreateLotteryLogic) => {
  if (success) {
    return <Alert text="抽選イベントが正常に作成されました。抽選一覧ページにリダイレクトします..." type="success" />;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">抽選イベント作成</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/lotteries"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">基本情報</h3>
            <p className="mt-1 text-sm text-gray-500">抽選イベントの基本情報を入力してください。</p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                抽選名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="春のパン祭り"
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
              <p className="mt-2 text-sm text-gray-500">抽選の詳細な説明を入力してください。</p>
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
              <label htmlFor="resultAt" className="block text-sm font-medium text-gray-700 mb-1">
                結果発表日時 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="resultAt"
                name="resultAt"
                value={formData.resultAt}
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
                <option value={LotteryStatus.DRAFT}>下書き</option>
                <option value={LotteryStatus.ACTIVE}>完成</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">抽選商品</h3>
            <p className="mt-1 text-sm text-gray-500">抽選に含める商品を選択してください。</p>
          </div>

          {productLoading ? (
            <Loading />
          ) : (
            <div className="mt-6">
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-full sm:w-1/2">
                    <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      商品 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`product-${index}`}
                      value={product.productId}
                      onChange={(e) => handleProductChange(index, "productId", Number.parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>商品を選択してください</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ¥{p.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/4">
                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", Number.parseInt(e.target.value))}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-full sm:w-1/4 flex items-end justify-end mt-4 sm:mt-0">
                    <Button label="削除" onClick={() => handleRemoveProduct(index)} color="red" variant="tonal" />
                  </div>
                </div>
              ))}

              <div className="text-center">
                <Button label="商品を追加" onClick={handleAddProduct} color="blue" />
              </div>
            </div>
          )}
        </div>

        {error && <Alert text={error} type="error" />}

        <div className="pt-5">
          <div className="flex justify-end gap-4">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Link
                  href="/admin/lotteries"
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

export default CreateLotteryView;
