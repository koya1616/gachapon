"use client";
import { useState } from "react";

interface UploadResult {
  key: string;
}

export default function CreateProduct() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", image: "", price: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!file) {
      setError("ファイルを選択してください");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const fileFormData = new FormData();
      fileFormData.append("file", file);
      fileFormData.append("code", sessionStorage.getItem("admin-code") || "");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: fileFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "アップロードに失敗しました");
      }

      setUploadResult(data);
      setFormData({
        name: "",
        image: `https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/${data.key}`,
        price: "",
      });
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      await fetch("/api/deploy");
      alert("商品が作成されました。反映されるまでに数分かかります。");
      window.location.reload();
    } catch (error) {
      setError("商品作成に失敗しました");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg mt-4">
      <h2 className="text-xl font-bold">商品を登録</h2>
      <p className="mb-4">ファイル名は小文字の英語のみ</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${uploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {uploading ? "アップロード中..." : "アップロード"}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

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
          {submitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>送信完了しました！</p>
              <p className="mt-2">名前: {formData.name}</p>
              <p>価格: {formData.price}円</p>
              <div>
                <img
                  src={`https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/${uploadResult.key}`}
                  alt="Uploaded"
                  className="mt-2 w-full h-auto rounded-md"
                />
              </div>
            </div>
          ) : (
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  送信する
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
