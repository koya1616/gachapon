import { executeQuery } from "@/lib/db";
import type { TestProject } from "vitest/node";

export default async function setup(project: TestProject) {
  await executeQuery("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE products RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE paypay_payments RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE shipments RESTART IDENTITY CASCADE");
  await executeQuery("TRUNCATE TABLE payment_products RESTART IDENTITY CASCADE");
}
