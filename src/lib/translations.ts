import type { Lang } from "@/types";

const translations = {
  en: {
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      total: "Total:",
      clear_cart: "Clear Cart",
      checkout: "Proceed to Checkout",
      remove: "Remove",
    },
    product: {
      add_to_cart: "Add to Cart",
    },
    login: {
      facebook: "Login with Facebook",
      google: "Login with Google",
      twitter: "Login with Twitter",
      not_have_account: "Don't have an account?",
      sign_up: "Sign Up",
    },
    signup: {
      google: "Sign up with Google",
    },
    account: {
      title: "Account Details",
      address: "Address",
      order_history: "Order History",
      order_id: "Order ID",
      date: "Date",
      total: "Total",
      status: "Status",
      logout: "Logout",
      no_orders: "No order history available",
      currency: "$",
    },
    order: {
      status: {
        delivered: "Delivered",
        processing: "Processing",
        shipped: "Shipped",
      },
    },
    form: {
      country_select: "Select Country",
      recipient_name: "Recipient Name",
      postal_code: "Postal Code",
      address: "Address",
      clear: "Clear",
      register: "Register",
      fail: {
        address: "Failed to save. Please try again.",
      },
    },
  },
  ja: {
    cart: {
      title: "カート",
      empty: "カートは空です",
      total: "合計:",
      clear_cart: "カートを空にする",
      checkout: "購入手続きへ",
      remove: "削除",
    },
    product: {
      add_to_cart: "カートに追加",
    },
    login: {
      facebook: "Facebookでログイン",
      google: "Googleでログイン",
      twitter: "Twitterでログイン",
      not_have_account: "アカウントをお持ちでないですか？",
      sign_up: "新規登録",
    },
    signup: {
      google: "Googleで登録",
    },
    account: {
      title: "アカウント詳細",
      address: "住所",
      order_history: "注文履歴",
      order_id: "注文ID",
      date: "日付",
      total: "合計",
      status: "状態",
      logout: "ログアウト",
      no_orders: "注文履歴はありません",
      currency: "¥",
    },
    order: {
      status: {
        delivered: "配達済み",
        processing: "処理中",
        shipped: "発送済み",
      },
    },
    form: {
      country_select: "国を選択",
      recipient_name: "氏名",
      postal_code: "郵便番号",
      address: "住所",
      clear: "クリア",
      register: "登録",
      fail: {
        address: "保存に失敗しました。再度お試しください。",
      },
    },
  },
  zh: {
    cart: {
      title: "购物车",
      empty: "您的购物车是空的",
      total: "总计:",
      clear_cart: "清空购物车",
      checkout: "结账",
      remove: "删除",
    },
    product: {
      add_to_cart: "加入购物车",
    },
    login: {
      facebook: "Facebook登录",
      google: "Google登录",
      twitter: "Twitter登录",
      not_have_account: "您没有账户吗？",
      sign_up: "注册",
    },
    signup: {
      google: "Google注册",
    },
    account: {
      title: "账户详细信息",
      address: "地址",
      order_history: "订单历史",
      order_id: "订单ID",
      date: "日期",
      total: "总计",
      status: "状态",
      logout: "登出",
      no_orders: "没有订单历史",
      currency: "¥",
    },
    order: {
      status: {
        delivered: "已送达",
        processing: "处理中",
        shipped: "已发货",
      },
    },
    form: {
      country_select: "选择国家",
      recipient_name: "收件人姓名",
      postal_code: "邮政编码",
      address: "地址",
      clear: "清除",
      register: "注册",
      fail: {
        address: "保存失败，请重试。",
      },
    },
  },
};

export const useTranslation = (lang: Lang) => {
  return translations[lang];
};
