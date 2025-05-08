import type { Lang, Order } from "@/types";
import { useTranslation as t } from "@/lib/translations";

const getShipmentStatus = (shipment: Order): StatusType => {
  if (shipment.payment_failed_at) return "payment_failed";
  if (shipment.cancelled_at) return "cancelled";
  if (shipment.delivered_at) return "delivered";
  if (shipment.shipped_at) return "shipped";
  return "processing";
};

type StatusType = "delivered" | "processing" | "shipped" | "payment_failed" | "cancelled";
const statusStyles: Record<StatusType, string> = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  payment_failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const OrderStatusBadge = ({ order, lang }: { order: Order; lang: Lang }) => {
  const status = getShipmentStatus(order) as StatusType;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {t(l).order.status[status]}
    </span>
  );
};

export default OrderStatusBadge;
