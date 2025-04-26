import type { Shipment } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

export async function createShipmentWithTransaction(
  client: Client,
  shipment: Pick<Shipment, "paypay_payment_id" | "address">,
): Promise<void> {
  const query = `
    INSERT INTO shipments (paypay_payment_id, address)
    VALUES ($1, $2)
  `;
  const params = [shipment.paypay_payment_id, shipment.address];
  await executeQueryWithClient(client, query, params);
}
