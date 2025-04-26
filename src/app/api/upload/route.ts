import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

const {
  R2_ACCOUNT_ID = "",
  R2_ACCESS_KEY_ID = "",
  R2_SECRET_ACCESS_KEY = "",
  R2_BUCKET_NAME = "",
  ADMIN_CODE: ENV_ADMIN_CODE = "",
} = process.env;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
    if (adminToken !== ENV_ADMIN_CODE) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Please select a file" }, { status: 400 });
    }

    await uploadFileToR2(file);

    return NextResponse.json({ key: file.name }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

async function uploadFileToR2(file: File): Promise<void> {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: R2_BUCKET_NAME,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    },
  });

  await upload.done();
}
