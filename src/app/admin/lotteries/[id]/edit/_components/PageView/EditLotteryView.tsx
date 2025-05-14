"use client";

import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { LotteryStatus } from "@/types";
import Link from "next/link";
import type { EditLotteryLogic } from "../../page";

const EditLotteryView = ({
  formData,
  products,
  selectedProducts,
  loading,
  error,
  success,
  handleInputChange,
  handleDateInputChange,
  handleSubmit,
  handleAddProduct,
  handleRemoveProduct,
  handleProductChange,
}: EditLotteryLogic) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">抽選イベント編集</h1>
        <Link
          href={`/admin/lotteries/${formData.id}`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          戻る
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative"
          role="alert"
        >
          <span className="block sm:inline">抽選イベントが更新されました。</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            抽選名
          </label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 mb-1">
              開始日時
            </label>
            <input
              id="startAt"
              name="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={handleDateInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 mb-1">
              終了日時
            </label>
            <input
              id="endAt"
              name="endAt"
              type="datetime-local"
              value={formData.endAt}
              onChange={handleDateInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="resultAt" className="block text-sm font-medium text-gray-700 mb-1">
              結果発表日時
            </label>
            <input
              id="resultAt"
              name="resultAt"
              type="datetime-local"
              value={formData.resultAt}
              onChange={handleDateInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="paymentDeadlineAt" className="block text-sm font-medium text-gray-700 mb-1">
              支払期限
            </label>
            <input
              id="paymentDeadlineAt"
              name="paymentDeadlineAt"
              type="datetime-local"
              value={formData.paymentDeadlineAt}
              onChange={handleDateInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select id="status" name="status" value={formData.status} onChange={handleInputChange} required>
            <option value={LotteryStatus.DRAFT}>下書き</option>
            <option value={LotteryStatus.ACTIVE}>実施中</option>
            <option value={LotteryStatus.FINISHED}>終了</option>
            <option value={LotteryStatus.CANCELLED}>キャンセル</option>
          </select>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">抽選商品</h3>
            <p className="mt-1 text-sm text-gray-500">抽選に含める商品を選択してください。</p>
          </div>

          {loading ? (
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
                      {" "}
                      数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", Number.parseInt(e.target.value))}
                      min="1"
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

        <div className="flex justify-end">{loading ? <Loading /> : <Button label="更新する" type="submit" />}</div>
      </form>
    </div>
  );
};

export default EditLotteryView;
