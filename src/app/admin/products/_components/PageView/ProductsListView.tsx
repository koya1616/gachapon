import Badge from "@/components/Badge";
import Loading from "@/components/Loading";
import Link from "next/link";
import type { ProductsListLogic } from "../../page";

const ProductsListView = ({ products, loading }: ProductsListLogic) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">商品一覧</h1>
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">商品一覧</h1>

      <div className="flex justify-end mb-4 sm:mb-6">
        <Link
          href="/admin/upload"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <title>Plus</title>
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          商品を追加
        </Link>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">商品画像</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">商品名</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">価格</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">在庫数</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b">{product.id}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b font-medium">{product.name}</td>
                  <td className="py-3 px-4 border-b">¥{product.price.toLocaleString()}</td>
                  <td className="py-3 px-4 border-b">
                    <Badge
                      text={`${product.stock_quantity}`}
                      color={product.stock_quantity > 10 ? "green" : product.stock_quantity > 0 ? "yellow" : "red"}
                    />
                  </td>
                  <td className="py-3 px-4 border-b">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Eye</title>
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                  商品が登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">ID: {product.id}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-lg font-semibold text-gray-900">¥{product.price.toLocaleString()}</div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock_quantity > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock_quantity > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  在庫: {product.stock_quantity}
                </span>
              </div>

              <Link
                href={`/admin/products/${product.id}`}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Eye</title>
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                商品詳細を見る
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-6 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            商品が登録されていません
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsListView;
