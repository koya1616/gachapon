"use client";

import type { Lang, LotteryEntry, LotteryEvent, Product } from "@/types";
import { useState } from "react";
import View from "./View";

export interface ProductDetailLogic {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  lotteryEntries: LotteryEntry[];
  isLogin: boolean;
  loadingEventId: number | null;
  successEventId: number | null;
  error: string | null;
  handleLotteryEntry: (eventId: number) => Promise<void>;
}

const useLogic = ({
  product,
  lang,
  lotteryEvents,
  lotteryEntries,
  isLogin,
  createLotteryEntry,
}: LogicProps): ProductDetailLogic => {
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [successEventId, setSuccessEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLotteryEntry = async (eventId: number) => {
    try {
      setLoadingEventId(eventId);
      setError(null);
      await createLotteryEntry(eventId);
      setSuccessEventId(eventId);
    } catch (err) {
      setError(typeof err === "string" ? err : "エントリーに失敗しました");
    } finally {
      setLoadingEventId(null);
    }
  };

  return {
    product,
    lang,
    lotteryEvents,
    lotteryEntries,
    isLogin,
    loadingEventId,
    successEventId,
    error,
    handleLotteryEntry,
  };
};

interface LogicProps {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  lotteryEntries: LotteryEntry[];
  isLogin: boolean;
  createLotteryEntry: (lotteryEventId: number) => Promise<void>;
}

const Logic = (props: LogicProps) => {
  return <View {...useLogic(props)} />;
};

export default Logic;
