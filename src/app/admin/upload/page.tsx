"use client";

import type { Product } from "@/types";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

type UploadResult = {
  key: string;
};

const FileUploadForm = memo(
  ({
    onUploadSuccess,
  }: {
    onUploadSuccess: (result: UploadResult) => void;
  }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        setError(null);
      }
    }, []);

    const handleSubmit = useCallback(
      async (e: { preventDefault: () => void }) => {
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

          const response = await fetch("/api/upload", {
            method: "POST",
            body: fileFormData,
          });

          const { data }: { data: UploadResult } = await response.json();

          if (response.status === 401) {
            window.location.href = "/admin/login";
            return;
          }

          if (!response.ok) {
            throw new Error("アップロードに失敗しました");
          }

          onUploadSuccess(data);
          setFile(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "アップロードに失敗しました");
        } finally {
          setUploading(false);
        }
      },
      [file, onUploadSuccess],
    );

    const buttonClassName = useMemo(
      () =>
        `w-full py-2 px-4 rounded-md font-medium text-white ${uploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`,
      [uploading, file],
    );

    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="fileUpload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button type="submit" disabled={uploading || !file} className={buttonClassName}>
            {uploading ? "アップロード中..." : "アップロード"}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      </>
    );
  },
);

const ProductForm = memo(
  ({
    imageUrl,
  }: {
    imageUrl: string;
  }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<Product, "id" | "quantity">>({
      name: "",
      image: imageUrl,
      price: 0,
      stock_quantity: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    const handleCreateProductSubmit = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/product", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.status === 401) {
            window.location.href = "/admin/login";
            return;
          }

          const { data: product }: { data: Product } = await response.json();
          await fetch("/api/deploy");
          alert("商品が作成されました。反映されるまでに数分かかります。");
          router.push(`/admin/products/${product.id}`);
        } catch (error) {
          setError("商品作成に失敗しました");
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData, router],
    );

    const submitButtonClassName = useMemo(
      () =>
        `w-full py-2 px-4 rounded-md font-medium text-white ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`,
      [isSubmitting],
    );

    return (
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

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <div className="flex items-center justify-between">
          <button type="submit" disabled={isSubmitting} className={submitButtonClassName}>
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </div>
      </form>
    );
  },
);

const Upload = () => {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleUploadSuccess = useCallback((result: UploadResult) => {
    setUploadResult(result);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg mt-4">
      <h2 className="text-xl font-bold">商品を登録</h2>
      <p className="mb-4">ファイル名は小文字の英語のみ</p>

      {!uploadResult && <FileUploadForm onUploadSuccess={handleUploadSuccess} />}

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

          <ProductForm imageUrl={`https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/${uploadResult.key}`} />
        </>
      )}
    </div>
  );
};

export default Upload;
