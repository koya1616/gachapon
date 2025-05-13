"use client";

import Badge from "@/components/Badge";
import { type Auction, AuctionStatus } from "@/types";
import { useCallback, useEffect, useState } from "react";
import AuctionsPageView from "./_components/PageView/AuctionsPageView";

export interface AuctionsPageLogic {
  auctions: Auction[];
  isLoading: boolean;
  error: string | null;
  getStatusBadge: (status: number) => React.ReactNode;
}

const useAuctionsPage = (): AuctionsPageLogic => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auction");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: auctions }: { data: Auction[] } = await response.json();
      setAuctions(auctions);
    } catch (error) {
      setError("オークションの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const getStatusBadge = (status: number) => {
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
  };

  return { auctions, isLoading, error, getStatusBadge };
};

const AuctionsPage = () => {
  return <AuctionsPageView {...useAuctionsPage()} />;
};

export default AuctionsPage;
