import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== (process.env.ADMIN_CODE || "")) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}`, {
    method: "get",
    headers: { Authorization: `Bearer ${VERCEL_API_TOKEN}`, "Content-Type": "application/json" },
  });
  const data = await response.json();
  const deploymentId = data.deployments[0].uid;

  await fetch("https://api.vercel.com/v13/deployments", {
    method: "post",
    headers: { Authorization: `Bearer ${VERCEL_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "gachapo",
      target: "production",
      deploymentId: deploymentId,
    }),
  });
  return NextResponse.json({ message: "OK", data: null }, { status: 200 });
}
