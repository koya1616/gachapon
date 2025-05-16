"use client";

import type { Lang, LotteryEvent, Product } from "@/types";
import { useState } from "react";
import ProductDetailView from "./ProductDetailView";

export interface ProductDetailLogic {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  isLogin: boolean;
  loadingEventId: number | null;
  successEventId: number | null;
  error: string | null;
  handleLotteryEntry: (eventId: number, productId: number) => Promise<void>;
}

const useProductDetailLogic = ({
  product,
  lang,
  lotteryEvents,
  isLogin,
  createLotteryEntry,
}: {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  isLogin: boolean;
  createLotteryEntry: (lotteryEventId: number, lotteryProductId: number) => Promise<void>;
}): ProductDetailLogic => {
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [successEventId, setSuccessEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLotteryEntry = async (eventId: number, productId: number) => {
    try {
      setLoadingEventId(eventId);
      setError(null);
      await createLotteryEntry(eventId, productId);
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
    isLogin,
    loadingEventId,
    successEventId,
    error,
    handleLotteryEntry,
  };
};

interface ProductDetailClientProps {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  isLogin: boolean;
  createLotteryEntry: (lotteryEventId: number, lotteryProductId: number) => Promise<void>;
}

const ProductDetailClient = (props: ProductDetailClientProps) => {
  return <ProductDetailView {...useProductDetailLogic(props)} />;
};

export default ProductDetailClient;
