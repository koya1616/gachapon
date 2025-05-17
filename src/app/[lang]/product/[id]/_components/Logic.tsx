"use client";

import type { Lang, LotteryEntry, LotteryEvent, Product } from "@/types";
import { useState } from "react";
import View from "./View";

const Logic = (props: {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  lotteryEntries: LotteryEntry[];
  isLogin: boolean;
  createLotteryEntry: (lotteryEventId: number) => Promise<void>;
}) => {
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [successEventId, setSuccessEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLotteryEntry = async (eventId: number) => {
    try {
      setLoadingEventId(eventId);
      setError(null);
      await props.createLotteryEntry(eventId);
      setSuccessEventId(eventId);
    } catch (err) {
      setError(typeof err === "string" ? err : "エントリーに失敗しました");
    } finally {
      setLoadingEventId(null);
    }
  };
  return (
    <View
      {...props}
      loadingEventId={loadingEventId}
      successEventId={successEventId}
      error={error}
      handleLotteryEntry={handleLotteryEntry}
    />
  );
};

export default Logic;
