"use client";

import type { LotteryEventApiResponse } from "@/app/api/lottery/[id]/route";
import Badge from "@/components/Badge";
import { type LotteryEntry, type LotteryEvent, type LotteryProduct, LotteryStatus, type Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LotteryDetailView from "./_components/PageView";

const TABS = ["基本情報", "商品一覧", "応募状況"] as const;
export interface LotteryDetailLogic {
  lottery: LotteryEvent | null;
  products: Product[];
  entries: { id: number; user_id: number; product_id: number; result: number }[];
  loading: boolean;
  error: string | null;
  getStatusBadge: (status: number) => React.ReactNode;
  getEntryResultBadge: (result: number) => React.ReactNode;
  tabs: readonly (typeof TABS)[number][];
  activeTab: (typeof TABS)[number];
  setActiveTab: (tab: (typeof TABS)[number]) => void;
}

const useLotteryDetail = (): LotteryDetailLogic => {
  const params = useParams();
  const router = useRouter();
  const [lottery, setLottery] = useState<LotteryEvent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("基本情報");
  const [lotteryEntries, setLotteryEntries] = useState<
    { id: number; user_id: number; product_id: number; result: number }[]
  >([]);

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

      const { data }: { data: LotteryEventApiResponse } = await response.json();
      setLottery(data.lottery);

      if (data.products && data.products.length > 0) {
        const productResponse = await fetch("/api/product");
        if (!productResponse.ok) {
          throw new Error("商品データの取得に失敗しました。");
        }

        const { data: allProducts }: { data: Product[] } = await productResponse.json();

        const enhancedProducts = data.products.map((lotteryProduct: LotteryProduct) => {
          const productDetails = allProducts.find((p) => p.id === lotteryProduct.product_id);
          if (!productDetails) {
            throw new Error("商品データが見つかりません。");
          }
          return productDetails;
        });

        setProducts(enhancedProducts);

        if (data.entries && data.entries.length > 0) {
          setLotteryEntries(
            data.entries.map((entry: LotteryEntry) => ({
              id: entry.id,
              user_id: entry.user_id,
              product_id: data.products.find((p) => p.id === entry.lottery_product_id)?.product_id || 0,
              result: entry.result,
            })),
          );
        } else {
          setLotteryEntries([]);
        }
      } else {
        setProducts([]);
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

  const getEntryResultBadge = useCallback((result: number) => {
    switch (result) {
      case 0:
        return <Badge text="抽選中" color="gray" />;
      case 1:
        return <Badge text="当選" color="green" />;
      case 2:
        return <Badge text="落選" color="red" />;
      default:
        return <Badge text="不明" color="gray" />;
    }
  }, []);

  return {
    lottery,
    products,
    entries: lotteryEntries,
    loading,
    error,
    getStatusBadge,
    getEntryResultBadge,
    tabs: TABS,
    activeTab,
    setActiveTab: (tab: (typeof TABS)[number]) => setActiveTab(tab),
  };
};

const LotteryDetailPage = () => {
  return <LotteryDetailView {...useLotteryDetail()} />;
};

export default LotteryDetailPage;
