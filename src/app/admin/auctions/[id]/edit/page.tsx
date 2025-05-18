"use client";

import type { UpdateAuctionApiRequestBody } from "@/app/api/auction/[id]/route";
import Badge from "@/components/Badge/Badge";
import { formatDateForInput } from "@/lib/date";
import { type Auction, AuctionStatus, type Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import EditAuctionView from "./_components/PageView/EditAuctionView";

export interface EditAuctionLogic {
  formData: {
    id: number;
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
  error: string | null;
  success: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getStatusBadge: (status: number) => React.ReactNode;
}

const useEditAuction = (): EditAuctionLogic => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    startAt: "",
    endAt: "",
    paymentDeadlineAt: "",
    status: AuctionStatus.DRAFT,
    isSealed: false,
    allowBidRetraction: false,
    needPaymentInfo: false,
    productId: 0,
    minimumBid: 0,
  });

  const fetchAuctionDetail = useCallback(async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/auction/${params.id}`);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("オークションデータの取得に失敗しました。");
      }

      const { data } = await response.json();
      const auction: Auction = data.auction;

      setFormData({
        id: auction.id,
        name: auction.name,
        description: auction.description || "",
        startAt: formatDateForInput(new Date(Number(auction.start_at))),
        endAt: formatDateForInput(new Date(Number(auction.end_at))),
        paymentDeadlineAt: formatDateForInput(new Date(Number(auction.payment_deadline_at))),
        status: auction.status,
        isSealed: auction.is_sealed,
        allowBidRetraction: auction.allow_bid_retraction,
        needPaymentInfo: auction.need_payment_info,
        productId: auction.product_id,
        minimumBid: auction.minimum_bid,
      });

      const productResponse = await fetch("/api/product");
      if (!productResponse.ok) {
        throw new Error("商品データの取得に失敗しました。");
      }

      const { data: allProducts } = await productResponse.json();
      setProducts(allProducts);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchAuctionDetail();
  }, [fetchAuctionDetail]);

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
      setSuccess(false);

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

        const body: UpdateAuctionApiRequestBody = {
          name: formData.name,
          description: formData.description,
          startAt: new Date(formData.startAt).getTime(),
          endAt: new Date(formData.endAt).getTime(),
          paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
          status: formData.status,
          isSealed: formData.isSealed,
          allowBidRetraction: formData.allowBidRetraction,
          needPaymentInfo: formData.needPaymentInfo,
          productId: formData.productId,
        };

        const response = await fetch(`/api/auction/${params.id}`, {
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
          throw new Error("オークションの更新に失敗しました");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/auctions/${params.id}`);
        }, 2000);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [formData, params.id, router],
  );

  const getStatusBadge = useCallback((status: number) => {
    switch (status) {
      case AuctionStatus.DRAFT:
        return <Badge text="下書き" color="gray" />;
      case AuctionStatus.ACTIVE:
        return <Badge text="開催中" color="green" />;
      case AuctionStatus.FINISHED:
        return <Badge text="終了" color="blue" />;
      case AuctionStatus.CANCELLED:
        return <Badge text="キャンセル" color="red" />;
      default:
        return <Badge text="不明" color="gray" />;
    }
  }, []);

  return {
    formData,
    products,
    loading,
    error,
    success,
    handleInputChange,
    handleDateInputChange,
    handleCheckboxChange,
    handleProductChange,
    handleSubmit,
    getStatusBadge,
  };
};

const EditAuctionPage = () => {
  return <EditAuctionView {...useEditAuction()} />;
};

export default EditAuctionPage;
