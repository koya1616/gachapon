import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { memo } from "react";
import type { UploadLogic } from "../../page";

const UploadView = memo(
  ({
    uploadResult,
    file,
    uploading,
    fileError,
    handleFileChange,
    handleFileSubmit,
    formData,
    formError,
    isSubmitting,
    handleProductChange,
    handleCreateProductSubmit,
  }: UploadLogic) => {
    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg mt-4">
        <h2 className="text-xl font-bold">商品を登録</h2>
        <p className="mb-4">ファイル名は小文字の英語のみ</p>

        {!uploadResult && (
          <>
            <form onSubmit={handleFileSubmit}>
              <div className="mb-4">
                <input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {uploading ? <Loading /> : <Button type="submit" label="アップロード" disabled={!file} />}
            </form>

            {fileError && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{fileError}</div>}
          </>
        )}

        {uploadResult && (
          <>
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md mb-2">
              <p className="font-medium">アップロード成功!</p>
              <p className="text-sm mt-1 break-all">ファイル: {uploadResult.key}</p>
              <a
                href={`https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/${uploadResult.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 block"
              >
                ファイルリンク
              </a>
            </div>

            <form onSubmit={handleCreateProductSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  商品名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleProductChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                  価格 (円)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleProductChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  required
                />
              </div>

              {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{formError}</div>}

              {isSubmitting ? <Loading /> : <Button type="submit" label="送信する" />}
            </form>
          </>
        )}
      </div>
    );
  },
);

export default UploadView;
