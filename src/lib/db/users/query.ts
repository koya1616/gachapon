import type { User } from "@/types";
import { executeQuery } from "..";

export async function findUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT * FROM users WHERE email = $1 LIMIT 1
  `;
  const params = [email];
  const users = await executeQuery<User>(query, params);
  return users.length > 0 ? users[0] : null;
}

export async function createUser(email: string): Promise<User> {
  const query = `
    INSERT INTO users (email)
    VALUES ($1)
    RETURNING *
  `;
  const params = [email];
  const result = await executeQuery<User>(query, params);
  return result[0];
}
