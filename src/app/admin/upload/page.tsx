"use client";

import type { Product } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import UploadView from "./_components/PageView";

type UploadResult = {
  key: string;
};

export interface UploadLogic {
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
    handleProductChange,
    handleCreateProductSubmit,
  };
};

const Upload = () => {
  return <UploadView {...useUpload()} />;
};

export default Upload;
