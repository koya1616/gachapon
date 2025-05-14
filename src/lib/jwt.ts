import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: number;
  type: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

export const generateToken = (payload: Omit<TokenPayload, "exp">): string => {
  return jwt.sign(payload, Buffer.from(JWT_SECRET_KEY, "utf-8"), { expiresIn: "30D" } as SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, Buffer.from(JWT_SECRET_KEY, "utf-8")) as TokenPayload;
  } catch (error) {
    return null;
  }
};
