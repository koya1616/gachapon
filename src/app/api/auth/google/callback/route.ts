import { cookies } from "next/headers";
import { createUser, findUserByEmail } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { USER_TOKEN } from "@/const/cookies";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GOOGLE_AUTH_REDIRECT_URI || "";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString(),
  });

  const tokenData = await tokenResponse.json();

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userResponse.json();

  let user = await findUserByEmail(userData.email);

  if (!user) {
    await createUser(userData.email);
    user = await findUserByEmail(userData.email);

    if (!user) redirect("/error");
  }
  const token = generateToken({ id: user.id, type: "user" });

  const cookieStore = await cookies();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 100);
  cookieStore.set(USER_TOKEN, token, {
    path: "/",
    expires: expirationDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/ja");
}
