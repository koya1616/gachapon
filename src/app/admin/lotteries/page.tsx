"use client";

import Badge from "@/components/Badge";
import Loading from "@/components/Loading";
import { formatDate } from "@/lib/date";
import { type LotteryEvent, LotteryStatus } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import LotteriesPageView from "./_components/PageView";

export interface LotteriesPageLogic {
  lotteries: LotteryEvent[];
  loading: boolean;
  getStatusBadge: (status: number) => React.ReactNode;
}

const useLotteriesPage = (): LotteriesPageLogic => {
  const [lotteries, setLotteries] = useState<LotteryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLotteries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lottery");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: lotteryEvents }: { data: LotteryEvent[] } = await response.json();
      setLotteries(lotteryEvents);
    } catch (error) {
      setLotteries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLotteries();
  }, [fetchLotteries]);

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
    lotteries,
    loading,
    getStatusBadge,
  };
};

const LotteriesPage = () => {
  return <LotteriesPageView {...useLotteriesPage()} />;
};

export default LotteriesPage;
