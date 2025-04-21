import type { Lang } from "@/types";

const translations = {
  en: {
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      total: "Total:",
      clearCart: "Clear Cart",
      checkout: "Proceed to Checkout",
      remove: "Remove",
    },
    product: {
      addToCart: "Add to Cart",
    },
  },
  ja: {
    cart: {
      title: "カート",
      empty: "カートは空です",
      total: "合計:",
      clearCart: "カートを空にする",
      checkout: "購入手続きへ",
      remove: "削除",
    },
    product: {
      addToCart: "カートに追加",
    },
  },
  zh: {
    cart: {
      title: "购物车",
      empty: "您的购物车是空的",
      total: "总计:",
      clearCart: "清空购物车",
      checkout: "结账",
      remove: "删除",
    },
    product: {
      addToCart: "加入购物车",
    },
  },
};

export const useTranslation = (lang: Lang) => {
  return translations[lang];
};
