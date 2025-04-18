import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const ADMIN_CODE = process.env.ADMIN_CODE;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const code = formData.get("code");

    if (code !== ADMIN_CODE) {
      return NextResponse.json({ error: "認証を行ってください" }, { status: 403 });
    }

    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      url: `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${file.name}`,
      key: file.name,
    });
  } catch (error) {
    console.error("アップロードエラー:", error);
    return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 });
  }
}
