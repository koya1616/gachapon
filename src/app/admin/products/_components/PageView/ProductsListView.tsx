import Badge from "@/components/Badge";
import Loading from "@/components/Loading";
import Table from "@/components/Table";
import Link from "next/link";
import type { ProductsListLogic } from "../../page";

const ProductsListView = ({ products, loading }: ProductsListLogic) => {
  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="h-10 w-1 bg-blue-600 rounded-full mr-3 hidden sm:block" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">商品一覧</h2>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/upload"
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              商品を追加
            </Link>
          </div>
        </div>
      </div>

      <Table
        data={products}
        keyExtractor={(product) => product.id}
        columns={[
          {
            header: "ID",
            accessor: "id",
          },
          {
            header: "商品画像",
            accessor: (product) => (
              <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ),
          },
          {
            header: "商品名",
            accessor: "name",
          },
          {
            header: "価格",
            accessor: (product) => `¥${product.price.toLocaleString()}`,
          },
          {
            header: "在庫数",
            accessor: (product) => (
              <Badge
                text={`${product.stock_quantity}`}
                color={product.stock_quantity > 10 ? "green" : product.stock_quantity > 0 ? "yellow" : "red"}
              />
            ),
          },
          {
            header: "",
            accessor: (product) => (
              <Link href={`/admin/products/${product.id}`} className="text-blue-500 hover:text-blue-700">
                詳細
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProductsListView;
