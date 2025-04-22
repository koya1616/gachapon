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
    login: {
      facebook: "Login with Facebook",
      google: "Login with Google",
      twitter: "Login with Twitter",
      notHaveAccount: "Don't have an account?",
      signUp: "Sign Up",
    },
    signup: {
      google: "Sign up with Google",
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
    login: {
      facebook: "Facebookでログイン",
      google: "Googleでログイン",
      twitter: "Twitterでログイン",
      notHaveAccount: "アカウントをお持ちでないですか？",
      signUp: "新規登録",
    },
    signup: {
      google: "Googleで登録",
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
    login: {
      facebook: "Facebook登录",
      google: "Google登录",
      twitter: "Twitter登录",
      notHaveAccount: "您没有账户吗？",
      signUp: "注册",
    },
    signup: {
      google: "Google注册",
    },
  },
};

export const useTranslation = (lang: Lang) => {
  return translations[lang];
};
