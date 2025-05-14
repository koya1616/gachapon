"use client";

import type { AuctionApiResponse } from "@/app/api/auction/[id]/route";
import Badge from "@/components/Badge";
import { type Auction, AuctionStatus, type Product, type SealedBid } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuctionDetailView from "./_components/PageView";

const TABS = ["基本情報", "入札状況"] as const;
export interface AuctionDetailLogic {
  auction: Auction | null;
  product: Product | null;
  bids: SealedBid[];
  loading: boolean;
  error: string | null;
  getStatusBadge: (status: number) => React.ReactNode;
  tabs: readonly (typeof TABS)[number][];
  activeTab: (typeof TABS)[number];
  setActiveTab: (tab: (typeof TABS)[number]) => void;
}

const useAuctionDetail = (): AuctionDetailLogic => {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<SealedBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("基本情報");

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

      const { data }: { data: AuctionApiResponse } = await response.json();
      setAuction(data.auction);
      setProduct(data.product);
      setBids(data.bids);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchAuctionDetail();
  }, [fetchAuctionDetail]);

  const getStatusBadge = useCallback((status: number) => {
    switch (status) {
      case AuctionStatus.DRAFT:
        return <Badge text="下書き" color="gray" />;
      case AuctionStatus.ACTIVE:
        return <Badge text="実施中" color="green" />;
      case AuctionStatus.FINISHED:
        return <Badge text="終了" color="blue" />;
      case AuctionStatus.CANCELLED:
        return <Badge text="キャンセル" color="red" />;
      default:
        return <Badge text="不明" color="gray" />;
    }
  }, []);

  return {
    auction,
    product,
    bids,
    loading,
    error,
    getStatusBadge,
    tabs: TABS,
    activeTab,
    setActiveTab: (tab: (typeof TABS)[number]) => setActiveTab(tab),
  };
};

const AuctionDetailPage = () => {
  return <AuctionDetailView {...useAuctionDetail()} />;
};

export default AuctionDetailPage;
