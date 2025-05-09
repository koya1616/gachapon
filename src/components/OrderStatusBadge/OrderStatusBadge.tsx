import type { Lang, Order } from "@/types";
import { useTranslation as t } from "@/lib/translations";
import Badge from "../Badge";

const getShipmentStatus = (shipment: Order): StatusType => {
  if (shipment.payment_failed_at) return "payment_failed";
  if (shipment.cancelled_at) return "cancelled";
  if (shipment.delivered_at) return "delivered";
  if (shipment.shipped_at) return "shipped";
  return "processing";
};

type StatusType = "delivered" | "processing" | "shipped" | "payment_failed" | "cancelled";
type BadgeColorType = "green" | "yellow" | "blue" | "red" | "gray";
const statusStyles: Record<StatusType, BadgeColorType> = {
  delivered: "green",
  processing: "yellow",
  shipped: "blue",
  payment_failed: "red",
  cancelled: "gray",
};

const OrderStatusBadge = ({ order, lang }: { order: Order; lang: Lang }) => {
  const status = getShipmentStatus(order) as StatusType;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  return <Badge text={t(l).order.status[status]} color={statusStyles[status]} />;
};

export default OrderStatusBadge;
