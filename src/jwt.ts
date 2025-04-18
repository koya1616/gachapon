import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  type: string;
}

export function generateToken(payload: Omit<TokenPayload, "exp">, secretKey: string): string {
  const token = jwt.sign(payload, Buffer.from(secretKey, "utf-8"), { expiresIn: "30D" } as SignOptions);
  return token;
}

export function verifyToken(token: string, secretKey: string): TokenPayload | null {
  try {
    return jwt.verify(token, Buffer.from(secretKey, "utf-8")) as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
