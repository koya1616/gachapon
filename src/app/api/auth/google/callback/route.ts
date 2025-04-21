import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

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
  console.log("aaaaaaaa")
  console.log(userData.email);
  console.log(userData.name);
  redirect("/ja");
}
