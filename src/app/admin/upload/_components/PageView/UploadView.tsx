import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import Link from "next/link";
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
                <input id="fileUpload" type="file" onChange={handleFileChange} />
              </div>

              {uploading ? <Loading /> : <Button type="submit" label="アップロード" disabled={!file} width="w-full" />}
            </form>

            {fileError && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{fileError}</div>}
          </>
        )}

        {uploadResult && (
          <>
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md mb-2">
              <p className="font-medium">アップロード成功!</p>
              <p className="text-sm mt-1 break-all">ファイル: {uploadResult.key}</p>
              <Link
                href={`${process.env.NEXT_PUBLIC_PUBLIC_STORAGE_URL}/${uploadResult.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 block"
              >
                ファイルリンク
              </Link>
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
                  min="0"
                  required
                />
              </div>

              {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{formError}</div>}

              {isSubmitting ? <Loading /> : <Button type="submit" label="送信する" width="w-full" />}
            </form>
          </>
        )}
      </div>
    );
  },
);

export default UploadView;
