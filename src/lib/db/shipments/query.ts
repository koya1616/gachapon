import type { Shipment } from "@/types";
import { executeQuery } from "..";

const shipmentStatuses = ["shipped", "delivered", "payment_failed", "cancelled"] as const;
export type ShipmentStatus = (typeof shipmentStatuses)[number];

export const findShipmentByMerchantPaymentId = async (merchant_payment_id: string): Promise<Shipment | null> => {
  const query = `
    SELECT s.*
    FROM shipments s
    INNER JOIN paypay_payments pp ON s.paypay_payment_id = pp.id
    WHERE pp.merchant_payment_id = $1
    LIMIT 1
  `;
  const params = [merchant_payment_id];
  const results = await executeQuery<Shipment>(query, params);
  return results.length > 0 ? results[0] : null;
};

export const findShipmentByMerchantPaymentIdAndUserId = async (
  merchant_payment_id: string,
  user_id: number,
): Promise<Shipment | null> => {
  const query = `
    SELECT s.*
    FROM shipments s
    INNER JOIN paypay_payments pp ON s.paypay_payment_id = pp.id
    WHERE pp.merchant_payment_id = $1 AND pp.user_id = $2
    LIMIT 1
  `;
  const params = [merchant_payment_id, user_id];
  const results = await executeQuery<Shipment>(query, params);
  return results.length > 0 ? results[0] : null;
};

export const updateShipmentStatus = async (id: number, status: ShipmentStatus): Promise<void> => {
  const statusMap: Record<ShipmentStatus, string> = {
    shipped: "shipped_at",
    delivered: "delivered_at",
    payment_failed: "payment_failed_at",
    cancelled: "cancelled_at",
  };

  const query = `
    UPDATE shipments
    SET ${statusMap[status]} = $1
    WHERE id = $2
  `;

  const params = [Date.now(), id];
  await executeQuery(query, params);
};

export const createShipment = async (shipment: Pick<Shipment, "paypay_payment_id" | "address">): Promise<Shipment> => {
  const query = `
    INSERT INTO shipments (paypay_payment_id, address)
    VALUES ($1, $2)
    RETURNING *
  `;
  const params = [shipment.paypay_payment_id, shipment.address];
  const results = await executeQuery<Shipment>(query, params);
  return results[0];
};
