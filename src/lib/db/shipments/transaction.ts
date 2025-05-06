import type { Shipment } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

export const createShipmentWithTransaction = async (
  client: Client,
  shipment: Pick<Shipment, "paypay_payment_id" | "address">,
): Promise<Shipment> => {
  const query = `
    INSERT INTO shipments (paypay_payment_id, address)
    VALUES ($1, $2)
    RETURNING *
  `;
  const params = [shipment.paypay_payment_id, shipment.address];
  const result = await executeQueryWithClient<Shipment>(client, query, params);
  return result[0];
};
