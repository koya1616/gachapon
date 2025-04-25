"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useTranslation as t } from "@/lib/translations";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import { PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const { cart, totalPrice, clear_cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paypay" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setIsLoading(true);

    if (paymentMethod === "paypay") {
      try {
        const response = await fetch("/api/paypay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [PAYPAY_TYPE]: PAYPAY_QR_CODE_CREATE,
          },
          body: JSON.stringify({
            merchantPaymentId: `PAYPAY_${Date.now()}_${crypto.randomUUID().split("-")[0]}`,
            orderItems: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              productId: item.id,
              unitPrice: {
                amount: item.price,
              },
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create PayPay payment");
        }

        const data = await response.json();
        if (!data.url) {
          throw new Error("No URL returned from PayPay");
        }

        clear_cart();
        router.push(data.url);
      } catch (error) {
        alert("Failed to process PayPay payment. Please try again.");
        setIsLoading(false);
      }
    } else {
      // Handle credit card payment
      // This would need to be implemented based on the credit card processor used

      // For now just show a placeholder implementation
      try {
        // Credit card implementation would go here
        router.push(`/${lang}/payment/credit/success`);
      } catch (error) {
        console.error("Credit card payment failed:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{t(l).checkout.title}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t(l).cart.title}</h2>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 relative mr-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-blue-700">¥{item.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">
                  {t(l).checkout.quantity}: {item.quantity}
                </span>
                <span className="font-semibold">¥{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">{t(l).cart.total}</span>
            <span className="font-bold text-xl">¥{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <AddressForm lang={l} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t(l).checkout.method}</h2>

        <div className="space-x-4 space-y-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("credit")}
            className={`w-[240] p-4 border rounded-lg cursor-pointer ${paymentMethod === "credit" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${paymentMethod === "credit" ? "border-blue-500" : "border-gray-400"} mr-3 flex items-center justify-center`}
              >
                {paymentMethod === "credit" && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-8 h-8 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title id="creditCardTitle">Credit card icon</title>
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 15H12" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>{t(l).checkout.credit}</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("paypay")}
            className={`w-[240] p-4 border rounded-lg cursor-pointer ${paymentMethod === "paypay" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${paymentMethod === "paypay" ? "border-blue-500" : "border-gray-400"} mr-3 flex items-center justify-center`}
              >
                {paymentMethod === "paypay" && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="32"
                  viewBox="0 0 3517 882"
                  version="1.1"
                  style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: "2" }}
                  aria-hidden="true"
                >
                  <title id="payPayTitle">PayPay logo</title>
                  <g transform="matrix(1.96163,0,0,1.96163,2496.32,443.097)">
                    <g id="paypay-furima-seeklogo.com-2.svg" transform="matrix(1,0,0,1,-1250,-220.5)">
                      <path
                        d="M375.603,0.063C411.467,0.063 440.797,29.392 440.797,65.256L440.797,375.666C440.797,411.53 411.467,440.859 375.603,440.859L65.194,440.859C29.329,440.859 0,411.53 0,375.666L0,137.996L0.156,61.756C2.023,27.525 30.496,0.063 65.194,0.063L375.603,0.063Z"
                        style={{ fill: "white", fillRule: "nonzero" }}
                      />
                      <path
                        d="M1252.06,82.45L1173.95,82.45C1166.8,82.45 1161.04,88.207 1161.04,95.364L1161.04,341.357L1216.04,341.357L1216.04,253.369L1252.06,253.369C1305.28,253.369 1353.51,220.15 1353.51,163.903C1353.51,107.656 1305.28,82.45 1252.06,82.45ZM1216.04,226.918L1216.04,108.9C1216.04,108.9 1233,108.978 1252.06,108.978C1279.06,108.978 1308.78,129.439 1308.78,164.525C1308.78,199.612 1278.98,226.918 1252.06,226.918L1216.04,226.918ZM1447.18,147.488C1405.56,147.488 1384.16,157.679 1384.16,157.679L1389.22,173.083C1389.22,173.083 1404.93,165.848 1435.58,165.848C1469.74,165.848 1476.66,182.418 1476.66,205.057L1476.19,215.171C1468.88,212.993 1451.77,210.192 1434.26,210.192C1408.2,210.192 1365.26,226.218 1365.26,278.653C1365.26,328.521 1403.14,344.78 1429.98,344.78C1452.15,344.78 1465.69,337.934 1476.58,331.166L1476.58,341.435L1531.51,341.435L1531.51,205.057C1531.74,161.958 1488.88,147.488 1447.18,147.488ZM1449.51,320.43C1425.63,320.43 1408.51,302.848 1408.51,276.786C1408.51,250.724 1431.46,235.476 1452.31,235.476C1462.81,235.476 1472.85,238.354 1476.74,241.7L1476.74,308.371C1470.05,314.284 1462.19,320.43 1449.51,320.43ZM1660.18,364.852C1643.46,401.805 1616,406.551 1603.7,408.029C1590.79,409.507 1576.94,408.885 1576.94,408.885L1576.94,378.7C1601.45,378.7 1614.75,380.645 1629.22,351.938L1639.02,327.043L1548.7,147.41L1606.35,147.41L1665.55,266.828L1717.91,147.41L1755.41,147.41C1755.49,147.488 1676.91,327.976 1660.18,364.852ZM623.075,82.45L544.967,82.45C537.809,82.45 532.052,88.207 532.052,95.364L532.052,341.357L587.055,341.357L587.055,253.369L623.075,253.369C676.288,253.369 724.522,220.15 724.522,163.903C724.599,107.656 676.365,82.45 623.075,82.45ZM587.132,226.918L587.132,108.9C587.132,108.9 604.092,108.978 623.152,108.978C650.148,108.978 679.866,129.439 679.866,164.525C679.866,199.612 650.07,226.918 623.152,226.918L587.132,226.918ZM818.267,147.488C776.645,147.488 755.251,157.679 755.251,157.679L760.308,173.083C760.308,173.083 775.945,165.848 806.675,165.848C840.828,165.848 847.752,182.418 847.752,205.057L847.285,215.171C839.972,212.993 822.857,210.192 805.352,210.192C779.368,210.192 736.347,226.218 736.347,278.653C736.347,328.521 774.234,344.78 801.074,344.78C823.246,344.78 836.705,337.934 847.674,331.166L847.674,341.435L902.598,341.435L902.598,205.057C902.754,161.958 859.888,147.488 818.267,147.488ZM820.601,320.43C796.717,320.43 779.602,302.848 779.602,276.786C779.602,250.724 802.552,235.476 823.401,235.476C833.904,235.476 843.94,238.354 847.829,241.7L847.829,308.371C841.061,314.284 833.204,320.43 820.601,320.43ZM1031.2,364.852C1014.47,401.805 987.008,406.551 974.716,408.029C961.802,409.507 947.954,408.885 947.954,408.885L947.954,378.7C972.46,378.7 985.763,380.645 1000.23,351.938L1010.04,327.043L919.714,147.41L977.361,147.41L1036.56,266.828L1088.92,147.41L1126.42,147.41C1126.5,147.488 1047.92,327.976 1031.2,364.852Z"
                        style={{ fill: "rgb(63,58,57)", fillRule: "nonzero" }}
                      />
                      <path
                        d="M85.81,440.859L65.194,440.859C29.329,440.859 -0,411.53 -0,375.666L-0,137.996C58.503,132.084 113.039,132.24 160.884,136.83L85.81,440.859ZM350.941,235.398C361.288,193.31 293.372,154.334 184.69,139.63L145.247,303.781C236.347,308.138 339.816,280.676 350.941,235.398ZM375.603,0.063L65.194,0.063C30.496,0.063 2.023,27.525 0.156,61.756C260.075,54.443 386.494,144.843 366.656,235.009C348.763,316.151 266.298,347.27 132.332,357.539L112.261,440.937L375.603,440.937C411.467,440.937 440.797,411.608 440.797,375.744L440.797,65.256C440.797,29.392 411.467,0.063 375.603,0.063Z"
                        style={{ fill: "rgb(255,0,51)", fillRule: "nonzero" }}
                      />
                    </g>
                    <g id="paypay-furima-seeklogo.com-2.svg1" />
                  </g>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          href={`/${lang}`}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          {t(l).checkout.continue}
        </Link>

        <button
          type="button"
          onClick={handlePayment}
          disabled={!paymentMethod || isLoading || cart.length === 0}
          className={`px-6 py-3 ${!paymentMethod || isLoading || cart.length === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-md transition-colors`}
        >
          {isLoading ? t(l).checkout.processing : t(l).checkout.pay}
        </button>
      </div>
    </div>
  );
}
