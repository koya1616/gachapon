import Order from "@/components/Order";
import type { UserPayPayPageLogic } from "../../page";

const UserPayPayPageView = ({ paymentDetails, shipment, paymentProducts, l }: UserPayPayPageLogic) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Order paymentDetails={paymentDetails} shipment={shipment} paymentProducts={paymentProducts} lang={l} />
    </div>
  );
};

export default UserPayPayPageView;
