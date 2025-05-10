"use client";

import type { Product } from "@/types";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

type UploadResult = {
  key: string;
};

interface UploadLogic {
  uploadResult: UploadResult | null;
  handleUploadSuccess: (result: UploadResult) => void;
  file: File | null;
  uploading: boolean;
  fileError: string | null;
  fileButtonClassName: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileSubmit: (e: { preventDefault: () => void }) => Promise<void>;
  formData: Omit<Product, "id" | "quantity">;
  formError: string | null;
  isSubmitting: boolean;
  submitButtonClassName: string;
  handleProductChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateProductSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useUpload = (): UploadLogic => {
  const router = useRouter();
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Product, "id" | "quantity">>({
    name: "",
    image: "",
    price: 0,
    stock_quantity: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSuccess = useCallback((result: UploadResult) => {
    setUploadResult(result);
    setFormData((prev) => ({
      ...prev,
      image: `https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/${result.key}`,
    }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileError(null);
    }
  }, []);

  const handleFileSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      if (!file) {
        setFileError("ファイルを選択してください");
        return;
      }

      try {
        setUploading(true);
        setFileError(null);

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

        handleUploadSuccess(data);
        setFile(null);
      } catch (err) {
        setFileError(err instanceof Error ? err.message : "アップロードに失敗しました");
      } finally {
        setUploading(false);
      }
    },
    [file, handleUploadSuccess],
  );

  const fileButtonClassName = useMemo(
    () =>
      `w-full py-2 px-4 rounded-md font-medium text-white ${uploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`,
    [uploading, file],
  );

  const handleProductChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setFormError("商品作成に失敗しました");
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

  return {
    uploadResult,
    handleUploadSuccess,
    file,
    uploading,
    fileError,
    fileButtonClassName,
    handleFileChange,
    handleFileSubmit,
    formData,
    formError,
    isSubmitting,
    submitButtonClassName,
    handleProductChange,
    handleCreateProductSubmit,
  };
};

const UploadView = memo(
  ({
    uploadResult,
    handleUploadSuccess,
    file,
    uploading,
    fileError,
    fileButtonClassName,
    handleFileChange,
    handleFileSubmit,
    formData,
    formError,
    isSubmitting,
    submitButtonClassName,
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

              <button type="submit" disabled={uploading || !file} className={fileButtonClassName}>
                {uploading ? "アップロード中..." : "アップロード"}
              </button>
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

              <div className="flex items-center justify-between">
                <button type="submit" disabled={isSubmitting} className={submitButtonClassName}>
                  {isSubmitting ? "送信中..." : "送信する"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    );
  },
);

const Upload = () => {
  return <UploadView {...useUpload()} />;
};

export default Upload;
