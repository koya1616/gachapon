import { executeQuery } from "@/lib/db";
import type { TestProject } from "vitest/node";

export default async function setup(project: TestProject) {
  await executeQuery("TRUNCATE TABLE addresses RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE auctions RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE authentication_codes RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE lottery_events RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE lottery_products RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE products RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE payment_products RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE paypay_payments RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE sealed_bids RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE shipments RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
}
