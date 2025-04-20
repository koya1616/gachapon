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
};

export const useTranslation = (lang: Lang) => {
  return translations[lang];
};
