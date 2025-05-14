"use client";

import type { CreateAuctionApiRequestBody } from "@/app/api/auction/route";
import { AuctionStatus, type Product } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CreateAuctionView from "./_components/PageView";

export interface CreateAuctionLogic {
  formData: {
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    paymentDeadlineAt: string;
    status: AuctionStatus;
    isSealed: boolean;
    allowBidRetraction: boolean;
    needPaymentInfo: boolean;
    productId: number;
    minimumBid: number;
  };
  products: Product[];
  loading: boolean;
  productLoading: boolean;
  error: string | null;
  success: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const useCreateAuction = (): CreateAuctionLogic => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatDateForInput = useCallback((date: Date): string => {
    return date.toISOString().slice(0, 16);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startAt: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    endAt: formatDateForInput(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
    paymentDeadlineAt: formatDateForInput(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    status: AuctionStatus.DRAFT,
    isSealed: false,
    allowBidRetraction: false,
    needPaymentInfo: true,
    productId: 0,
    minimumBid: 100,
  });

  const fetchProducts = useCallback(async () => {
    setProductLoading(true);
    const response = await fetch("/api/product");
    const { data: products }: { data: Product[] } = await response.json();
    setProducts(products);
    setProductLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "status" ? Number.parseInt(value) : value,
      }));
    },
    [],
  );

  const handleDateInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const handleProductChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number.parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      productId,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        if (!formData.name.trim()) {
          throw new Error("オークション名を入力してください");
        }

        if (formData.productId === 0) {
          throw new Error("商品を選択してください");
        }

        const startDate = new Date(formData.startAt);
        const endDate = new Date(formData.endAt);
        const paymentDeadlineDate = new Date(formData.paymentDeadlineAt);

        if (startDate >= endDate) {
          throw new Error("開始日時は終了日時より前である必要があります");
        }

        if (endDate >= paymentDeadlineDate) {
          throw new Error("終了日時は支払期限より前である必要があります");
        }

        if (formData.minimumBid <= 0) {
          throw new Error("最低入札額は1以上である必要があります");
        }

        const body: CreateAuctionApiRequestBody = {
          ...formData,
          startAt: new Date(formData.startAt).getTime(),
          endAt: new Date(formData.endAt).getTime(),
          paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
          productId: formData.productId,
          minimumBid: formData.minimumBid,
        };

        const response = await fetch("/api/auction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("オークションの作成に失敗しました");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/auctions");
        }, 2000);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [formData, router],
  );

  return {
    formData,
    products,
    loading,
    productLoading,
    error,
    success,
    handleInputChange,
    handleDateInputChange,
    handleCheckboxChange,
    handleProductChange,
    handleSubmit,
  };
};

const CreateAuctionPage = () => {
  return <CreateAuctionView {...useCreateAuction()} />;
};

export default CreateAuctionPage;
