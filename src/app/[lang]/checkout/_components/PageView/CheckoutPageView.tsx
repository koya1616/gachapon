import AddressForm from "@/app/[lang]/_components/AddressForm";
import { CreditCardIcon, PayPayIcon } from "@/components/Icons";
import Loading from "@/components/Loading";
import { useTranslation as t } from "@/lib/translations";
import type { Lang, Product } from "@/types";
import Link from "next/link";

interface CheckoutPageLogic {
  l: Lang;
  cart: Product[];
  totalPrice: number;
  paymentMethod: "credit" | "paypay" | null;
  isLoading: boolean;
  handlePaymentMethodChange: (method: "credit" | "paypay") => void;
  handlePayment: () => Promise<void>;
}

const CheckoutPageView = ({
  l,
  cart,
  totalPrice,
  paymentMethod,
  isLoading,
  handlePaymentMethodChange,
  handlePayment,
}: CheckoutPageLogic) => {
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
            onClick={() => handlePaymentMethodChange("credit")}
            className={`w-[240] p-4 border rounded-lg cursor-pointer ${paymentMethod === "credit" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${paymentMethod === "credit" ? "border-blue-500" : "border-gray-400"} mr-3 flex items-center justify-center`}
              >
                {paymentMethod === "credit" && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <div className="flex items-center">
                <CreditCardIcon />
                <span>{t(l).checkout.credit}</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePaymentMethodChange("paypay")}
            className={`w-[240] p-4 border rounded-lg cursor-pointer ${paymentMethod === "paypay" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${paymentMethod === "paypay" ? "border-blue-500" : "border-gray-400"} mr-3 flex items-center justify-center`}
              >
                {paymentMethod === "paypay" && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <PayPayIcon />
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">{t(l).checkout.notice_title}</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>{t(l).checkout.notice_address}</li>
          <li>{t(l).checkout.notice_shipping}</li>
          <li>{t(l).checkout.notice_development}</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Link
          href={`/${l}`}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          {t(l).checkout.continue}
        </Link>

        {isLoading ? (
          <Loading />
        ) : (
          <button
            type="button"
            onClick={handlePayment}
            disabled={!paymentMethod || cart.length === 0}
            className={`px-6 py-3 ${!paymentMethod || cart.length === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-md transition-colors`}
          >
            {t(l).checkout.pay}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPageView;
