import { ADMIN_CODE } from "@/const/cookies";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
    if (adminToken !== process.env.ADMIN_CODE) {
      return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Bad request", data: null }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const upload = new Upload({
      client: new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
      }),
      params: {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: file.name,
        Body: buffer,
        ContentType: file.type,
      },
    });
    await upload.done();

    return NextResponse.json({ message: "OK", data: { key: file.name } }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0014:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
