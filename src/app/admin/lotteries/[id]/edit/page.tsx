"use client";

import type { DeleteLotteryEventApiRequestBody, UpdateLotteryEventApiRequestBody } from "@/app/api/lottery/[id]/route";
import Badge from "@/components/Badge/Badge";
import { formatDateForInput } from "@/lib/date";
import { type LotteryEvent, type LotteryProduct, LotteryStatus, type Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import EditLotteryView from "./_components/PageView/EditLotteryView";

// TODO: productを削除するAPIを叩く
export interface EditLotteryLogic {
  formData: {
    id: number;
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
  error: string | null;
  success: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getStatusBadge: (status: number) => React.ReactNode;
  handleAddProduct: () => void;
  handleRemoveProduct: (index: number) => void;
  handleProductChange: (index: number, field: string, value: number) => void;
}

const useEditLottery = (): EditLotteryLogic => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; productId: number; quantity: number }>>(
    [],
  );

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    startAt: "",
    endAt: "",
    resultAt: "",
    paymentDeadlineAt: "",
    status: LotteryStatus.DRAFT,
  });

  const fetchLotteryDetail = useCallback(async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/lottery/${params.id}`);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("抽選データの取得に失敗しました。");
      }

      const { data }: { data: { lottery: LotteryEvent; products: LotteryProduct[] } } = await response.json();

      setFormData({
        id: data.lottery.id,
        name: data.lottery.name,
        description: data.lottery.description || "",
        startAt: formatDateForInput(new Date(Number(data.lottery.start_at))),
        endAt: formatDateForInput(new Date(Number(data.lottery.end_at))),
        resultAt: formatDateForInput(new Date(Number(data.lottery.result_at))),
        paymentDeadlineAt: formatDateForInput(new Date(Number(data.lottery.payment_deadline_at))),
        status: data.lottery.status,
      });

      const productResponse = await fetch("/api/product");
      if (!productResponse.ok) {
        throw new Error("商品データの取得に失敗しました。");
      }

      const { data: allProducts }: { data: Product[] } = await productResponse.json();
      setProducts(allProducts);

      if (data.products && data.products.length > 0) {
        const enhancedProducts = data.products.map((lotteryProduct: LotteryProduct) => {
          const productDetails = allProducts.find((p) => p.id === lotteryProduct.product_id);
          if (!productDetails) {
            throw new Error("商品データが見つかりません。");
          }
          return { ...productDetails, quantity: lotteryProduct.quantity_available };
        });

        setSelectedProducts(
          enhancedProducts.map((product) => ({
            id: crypto.randomUUID(),
            productId: product.id,
            quantity: product.quantity,
          })),
        );
      } else {
        setSelectedProducts([]);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchLotteryDetail();
  }, [fetchLotteryDetail]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

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

        const body: UpdateLotteryEventApiRequestBody = {
          name: formData.name,
          description: formData.description,
          startAt: new Date(formData.startAt).getTime(),
          endAt: new Date(formData.endAt).getTime(),
          resultAt: new Date(formData.resultAt).getTime(),
          paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
          status: formData.status,
          products: selectedProducts.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        };

        const response = await fetch(`/api/lottery/${params.id}`, {
          method: "PUT",
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
          throw new Error("抽選の更新に失敗しました");
        }

        setSuccess(true);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [formData, params.id, router, selectedProducts],
  );

  const getStatusBadge = useCallback((status: number) => {
    switch (status) {
      case LotteryStatus.DRAFT:
        return <Badge text="下書き" color="gray" />;
      case LotteryStatus.ACTIVE:
        return <Badge text="実施中" color="green" />;
      case LotteryStatus.FINISHED:
        return <Badge text="終了" color="blue" />;
      case LotteryStatus.CANCELLED:
        return <Badge text="キャンセル" color="red" />;
      default:
        return <Badge text="不明" color="gray" />;
    }
  }, []);

  const handleAddProduct = useCallback(() => {
    setSelectedProducts((prev) => [...prev, { id: crypto.randomUUID(), productId: 0, quantity: 1 }]);
  }, []);

  const handleRemoveProduct = useCallback(
    async (index: number) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const body: DeleteLotteryEventApiRequestBody = {
        productId: Number(selectedProducts[index].productId),
      };

      await fetch(`/api/lottery/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      setSelectedProducts((prev) => {
        const updatedProducts = [...prev];
        updatedProducts.splice(index, 1);
        return updatedProducts;
      });
      setLoading(false);
    },
    [params.id, selectedProducts],
  );

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

  return {
    formData,
    products,
    selectedProducts,
    loading,
    error,
    success,
    handleInputChange,
    handleDateInputChange,
    handleSubmit,
    getStatusBadge,
    handleAddProduct,
    handleRemoveProduct,
    handleProductChange,
  };
};

const EditLotteryPage = () => {
  return <EditLotteryView {...useEditLottery()} />;
};

export default EditLotteryPage;
