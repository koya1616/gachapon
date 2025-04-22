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
    account: {
      title: "Account Details",
      address: "Address",
      orderHistory: "Order History",
      orderId: "Order ID",
      date: "Date",
      total: "Total",
      status: "Status",
      logout: "Logout",
      noOrders: "No order history available",
      currency: "$",
    },
    order: {
      status: {
        delivered: "Delivered",
        processing: "Processing",
        shipped: "Shipped",
      },
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
    account: {
      title: "アカウント詳細",
      address: "住所",
      orderHistory: "注文履歴",
      orderId: "注文ID",
      date: "日付",
      total: "合計",
      status: "状態",
      logout: "ログアウト",
      noOrders: "注文履歴はありません",
      currency: "¥",
    },
    order: {
      status: {
        delivered: "配達済み",
        processing: "処理中",
        shipped: "発送済み",
      },
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
    account: {
      title: "账户详细信息",
      address: "地址",
      orderHistory: "订单历史",
      orderId: "订单ID",
      date: "日期",
      total: "总计",
      status: "状态",
      logout: "登出",
      noOrders: "没有订单历史",
      currency: "¥",
    },
    order: {
      status: {
        delivered: "已送达",
        processing: "处理中",
        shipped: "已发货",
      },
    },
  },
};

export const useTranslation = (lang: Lang) => {
  return translations[lang];
};
