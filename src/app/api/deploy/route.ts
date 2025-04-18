import { NextResponse } from "next/server";

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function GET() {
  const deploymentId = await listDeployments();

  const payload = {
    name: "gachapo",
    target: "production",
    deploymentId: deploymentId,
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${VERCEL_API_TOKEN}` },
    body: JSON.stringify(payload),
  };

  await fetch("https://api.vercel.com/v13/deployments", options);
  return NextResponse.json({ message: "Deployment triggered successfully" }, { status: 200 });
}

async function listDeployments() {
  const options = {
    method: "get",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${VERCEL_API_TOKEN}` },
  };
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}`,
    options,
  );
  const data = await response.json();
  return data.deployments[0].uid;
}
