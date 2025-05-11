"use client";

import Badge from "@/components/Badge";
import { type LotteryEvent, type LotteryProduct, LotteryStatus, type Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LotteryDetailView from "./_components/PageView";

export interface LotteryDetailLogic {
  lottery: LotteryEvent | null;
  products: Product[];
  loading: boolean;
  error: string | null;
  getStatusBadge: (status: number) => React.ReactNode;
}

const useLotteryDetail = (): LotteryDetailLogic => {
  const params = useParams();
  const router = useRouter();
  const [lottery, setLottery] = useState<LotteryEvent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    lottery,
    products,
    loading,
    error,
    getStatusBadge,
  };
};

const LotteryDetailPage = () => {
  return <LotteryDetailView {...useLotteryDetail()} />;
};

export default LotteryDetailPage;
