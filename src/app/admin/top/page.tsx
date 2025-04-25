import Link from "next/link";

export default function AdminTop() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/products" className="block">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">商品一覧</h3>
                          <p className="mt-1 text-sm text-gray-500">商品の管理、編集を行います</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/upload" className="block">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">アップロード</h3>
                          <p className="mt-1 text-sm text-gray-500">新しい商品の登録を行います</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/payment" className="block">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">決済管理</h3>
                          <p className="mt-1 text-sm text-gray-500">決済情報の確認と管理を行います</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/lotteries" className="block">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">抽選管理</h3>
                          <p className="mt-1 text-sm text-gray-500">抽選の作成、編集を行います</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
