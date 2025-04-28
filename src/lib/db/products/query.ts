import type { Product } from "@/types";
import { executeQuery } from "..";

export async function getProducts(): Promise<Product[]> {
  return executeQuery<Product>("SELECT * FROM products ORDER BY stock_quantity DESC");
}

export async function createProducts(product: Omit<Product, "id" | "quantity" | "stock_quantity">): Promise<Product> {
  const query = `
    INSERT INTO products (name, price, image)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const params = [product.name, product.price, product.image];
  const products = await executeQuery<Product>(query, params);
  return products[0];
}

export async function findProductById(id: number): Promise<Product | null> {
  const query = "SELECT * FROM products WHERE id = $1 LIMIT 1";
  const params = [id];
  const products = await executeQuery<Product>(query, params);
  return products.length > 0 ? products[0] : null;
}

export async function updateProductById(id: number, productData: Partial<Product>): Promise<Product | null> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramCounter = 1;

  if (productData.name !== undefined) {
    updates.push(`name = $${paramCounter++}`);
    values.push(productData.name);
  }

  if (productData.price !== undefined) {
    updates.push(`price = $${paramCounter++}`);
    values.push(productData.price);
  }

  if (productData.stock_quantity !== undefined) {
    updates.push(`stock_quantity = $${paramCounter++}`);
    values.push(productData.stock_quantity);
  }

  if (updates.length === 0) {
    return findProductById(id);
  }

  values.push(id);

  const query = `
    UPDATE products
    SET ${updates.join(", ")}
    WHERE id = $${paramCounter}
    RETURNING *
  `;

  const products = await executeQuery<Product>(query, values);
  return products.length > 0 ? products[0] : null;
}
