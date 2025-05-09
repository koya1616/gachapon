"use client";

import type { CreateLotteryEventApiRequestBody } from "@/app/api/lottery/create/route";
import { LotteryStatus, type Product } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CreateLotteryView from "./_components/PageView";

export interface CreateLotteryLogic {
  formData: {
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    resultAt: string;
    paymentDeadlineAt: string;
    status: LotteryStatus;
  };
  products: Product[];
  selectedProducts: Array<{ id: string; productId: number; quantity: number }>;
  loading: boolean;
  productLoading: boolean;
  error: string | null;
  success: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddProduct: () => void;
  handleRemoveProduct: (index: number) => void;
  handleProductChange: (index: number, field: string, value: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const useCreateLottery = (): CreateLotteryLogic => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; productId: number; quantity: number }>>(
    [],
  );
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
    resultAt: formatDateForInput(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    paymentDeadlineAt: formatDateForInput(new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)),
    status: LotteryStatus.DRAFT,
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

  const handleAddProduct = useCallback(() => {
    setSelectedProducts((prev) => [...prev, { id: crypto.randomUUID(), productId: 0, quantity: 1 }]);
  }, []);

  const handleRemoveProduct = useCallback((index: number) => {
    setSelectedProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
  }, []);

  const handleProductChange = useCallback((index: number, field: string, value: number) => {
    setSelectedProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      return updatedProducts;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        if (!formData.name.trim()) {
          throw new Error("抽選名を入力してください");
        }

        const startDate = new Date(formData.startAt);
        const endDate = new Date(formData.endAt);
        const resultDate = new Date(formData.resultAt);
        const paymentDeadlineDate = new Date(formData.paymentDeadlineAt);

        if (startDate >= endDate) {
          throw new Error("開始日時は終了日時より前である必要があります");
        }

        if (endDate >= resultDate) {
          throw new Error("終了日時は結果発表日時より前である必要があります");
        }

        if (resultDate >= paymentDeadlineDate) {
          throw new Error("結果発表日時は支払期限より前である必要があります");
        }

        if (selectedProducts.length === 0) {
          throw new Error("少なくとも1つの商品を選択してください");
        }

        for (const product of selectedProducts) {
          if (product.productId === 0) {
            throw new Error("すべての商品を選択してください");
          }
          if (product.quantity <= 0) {
            throw new Error("商品の数量は1以上である必要があります");
          }
        }

        const body: CreateLotteryEventApiRequestBody = {
          ...formData,
          startAt: new Date(formData.startAt).getTime(),
          endAt: new Date(formData.endAt).getTime(),
          resultAt: new Date(formData.resultAt).getTime(),
          paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
          products: selectedProducts.map(({ productId, quantity }) => ({ productId, quantity })),
        };
        const response = await fetch("/api/lottery/create", {
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
          throw new Error("抽選の作成に失敗しました");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/lotteries");
        }, 2000);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [formData, selectedProducts, router],
  );

  return {
    formData,
    products,
    selectedProducts,
    loading,
    productLoading,
    error,
    success,
    handleInputChange,
    handleDateInputChange,
    handleAddProduct,
    handleRemoveProduct,
    handleProductChange,
    handleSubmit,
  };
};

const CreateLotteryPage = () => {
  const logic = useCreateLottery();
  return <CreateLotteryView {...logic} />;
};

export default CreateLotteryPage;
