"use client";

import { PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";
import { useCart } from "@/context/CartContext";
import type { PaypayQRCodeCreateRequest } from "@/lib/paypay";
import type { ApiResponse, Lang } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CheckoutPageView from "./_components/PageView";

const useCheckoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : ("ja" as Lang);

  const { cart, totalPrice, clear_cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paypay" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentMethodChange = useCallback((method: "credit" | "paypay") => {
    setPaymentMethod(method);
  }, []);

  const handlePayment = useCallback(async () => {
    if (!paymentMethod) return;

    setIsLoading(true);

    if (paymentMethod === "paypay") {
      try {
        const body: PaypayQRCodeCreateRequest = {
          merchantPaymentId: `PAYPAY_${Date.now()}_${crypto.randomUUID().split("-")[0]}`,
          orderItems: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            productId: String(item.id),
            unitPrice: { amount: item.price, currency: "JPY" },
          })),
        };
        const response = await fetch("/api/paypay", {
          method: "POST",
          headers: { "Content-Type": "application/json", [PAYPAY_TYPE]: PAYPAY_QR_CODE_CREATE },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Failed to create PayPay payment");
        }

        const { data }: ApiResponse<{ url: string }> = await response.json();

        clear_cart();
        router.push(data.url);
      } catch (error) {
        alert("Failed to process PayPay payment. Please try again.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [paymentMethod, cart, clear_cart, router]);

  return {
    l,
    cart,
    totalPrice,
    paymentMethod,
    isLoading,
    handlePaymentMethodChange,
    handlePayment,
  };
};

const CheckoutPage = () => {
  return <CheckoutPageView {...useCheckoutPage()} />;
};

export default CheckoutPage;
