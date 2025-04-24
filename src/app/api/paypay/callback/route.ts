import type { NextRequest } from "next/server";

/**
 * TODO: 決済処理
 * 1. QRコード作成すると同時に、merchantPaymentIdをDBに保存。配送と商品購入レコードの作成
 *   ・merchantPaymentIdの生成ロジック:
 *     - "PAYPAY_"のprefix
 *     - user_id
 *     - ランダム文字列: crypto.randomUUID().split('-')[0]
 *     - timestamp: new Date().toISOString().replace(/[-:T.Z]/g, '')
 * 2. callbackのmerchantPaymentIdで情報を取得。配送と商品購入レコードがなければ作成
 * 3. src/app/[lang]/payment/paypay/[id]/page.tsxにリダイレクト
 */
export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  console.log(request.nextUrl.searchParams.get("merchantPaymentId"));
}
