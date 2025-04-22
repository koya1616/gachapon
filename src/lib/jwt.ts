import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: number;
  type: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

export function generateToken(payload: Omit<TokenPayload, "exp">): string {
  const token = jwt.sign(payload, Buffer.from(JWT_SECRET_KEY, "utf-8"), { expiresIn: "30D" } as SignOptions);
  return token;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, Buffer.from(JWT_SECRET_KEY, "utf-8")) as TokenPayload;
  } catch (error) {
    return null;
  }
}
