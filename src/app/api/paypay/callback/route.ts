import type { NextRequest } from "next/server";

/**
 * TODO: 決済処理
 * 1. QRコード作成すると同時に、merchantPaymentIdをDBに保存。DB設計大事で商品と紐づくようにする
 * 2. callbackのmerchantPaymentIdで情報を取得
 * 3. 処理中であることの画面を表示
 * 4. 管理画面で決済の情報をみえるようにする、変えれるようにする
 */
export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  console.log(request.nextUrl.searchParams.get("merchantPaymentId"));
}
