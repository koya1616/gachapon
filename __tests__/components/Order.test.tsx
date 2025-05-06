import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Order from "@/components/Order";
import type { Lang, PaymentProduct, Shipment } from "@/types";
import type { PaypayGetCodePaymentDetailsResponse, PaypayGetCodePaymentDetailsStatus } from "@/lib/paypay";

vi.stubEnv("TZ", "UTC");

describe("Orderコンポーネント", () => {
  const mockPaymentProducts: PaymentProduct[] = [
    { id: 1, name: "商品1", price: 1000, image: "image1.jpg", quantity: 2, product_id: 1, paypay_payment_id: 1 },
    { id: 2, name: "商品2", price: 2000, image: "image2.jpg", quantity: 1, product_id: 2, paypay_payment_id: 2 },
  ];

  const mockPaymentDetails: PaypayGetCodePaymentDetailsResponse = {
    data: {
      status: "COMPLETED",
      amount: { amount: 4000 },
      requestedAt: 1630000000,
      acceptedAt: 1640001000,
    },
  };

  const mockShipment: Shipment = {
    id: 1,
    paypay_payment_id: 1,
    address: "東京都渋谷区...",
    created_at: 1620000000,
    shipped_at: 1620010000,
    delivered_at: null,
    cancelled_at: null,
    payment_failed_at: null,
  };

  const renderOrder = async (
    props: {
      paymentDetails?: PaypayGetCodePaymentDetailsResponse | null;
      shipment?: Shipment | null;
      paymentProducts?: PaymentProduct[];
      lang?: Lang;
    } = {},
  ) => {
    const defaultProps = {
      paymentDetails: mockPaymentDetails,
      shipment: mockShipment,
      paymentProducts: mockPaymentProducts,
      lang: "ja" as Lang,
    };

    return render(await Order({ ...defaultProps, ...props }));
  };

  const expectTextToExist = (text: string) => {
    expect(screen.getByText(text)).toBeDefined();
  };

  const expectTextsToExist = (texts: string[]) => {
    texts.forEach(expectTextToExist);
  };

  const expectDateDisplay = (labelText: string, dateString: string) => {
    expectTextToExist(labelText);
    expectTextToExist(dateString);
  };

  const testShipmentStatus = async (
    statusField: keyof Shipment,
    timestamp: number,
    expectedStatus: string,
    expectedLabel: string,
  ) => {
    const modifiedShipment = {
      ...mockShipment,
      [statusField]: timestamp,
    };

    await renderOrder({ shipment: modifiedShipment });

    expectTextToExist(expectedStatus);
    expectDateDisplay(expectedLabel, "1970/1/19 18:00:20");
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("支払い情報が正しく表示されること", async () => {
    await renderOrder();

    expectTextsToExist([
      "決済詳細",
      "ステータス:",
      "COMPLETED",
      "金額:",
      "リクエスト日時:",
      "1970/1/19 20:46:40",
      "承認日時:",
      "1970/1/19 23:33:21",
    ]);

    expect(screen.getAllByText("¥4,000").length).toBe(2);
  });

  it("配送情報が正しく表示されること", async () => {
    await renderOrder();

    expectTextsToExist(["配送情報", "配送ステータス:", "発送済み", "配送先住所:", "東京都渋谷区..."]);

    expectDateDisplay("作成日時:", "1970/1/19 18:00:00");
    expectDateDisplay("発送日時:", "1970/1/19 18:00:10");
  });

  it("商品情報が正しく表示されること", async () => {
    await renderOrder();

    expectTextsToExist(["購入商品", "商品1", "商品2", "2 × ¥1,000", "1 × ¥2,000", "合計金額:"]);

    expect(screen.getAllByText("¥4,000").length).toBe(2);
  });

  it("支払い情報がnullの場合、「不明」と表示されること", async () => {
    await renderOrder({ paymentDetails: null });

    expectTextsToExist(["決済詳細", "ステータス:", "不明"]);
  });

  it("支払い状態がCOMPLETED以外の場合、リクエスト日時と決済完了日時が表示されないこと", async () => {
    const incompletePayment = {
      data: {
        status: "CREATED" as PaypayGetCodePaymentDetailsStatus,
        amount: { amount: 4000 },
        requestedAt: 1620000000,
        acceptedAt: 1660000000,
      },
    };

    await renderOrder({ paymentDetails: incompletePayment });

    expect(screen.queryByText("リクエスト日時:")).toBeNull();
    expect(screen.queryByText("決済完了日時:")).toBeNull();
  });

  it("配送情報がnullの場合、「配送情報はありません」と表示されること", async () => {
    await renderOrder({ shipment: null });

    expectTextsToExist(["配送情報", "配送情報はありません"]);
  });

  it("配送ステータスが正しく表示されること - 決済失敗", async () => {
    await testShipmentStatus("payment_failed_at", 1620020000, "決済失敗", "決済失敗日時:");
  });

  it("配送ステータスが正しく表示されること - キャンセル済み", async () => {
    await testShipmentStatus("cancelled_at", 1620020000, "キャンセル済み", "キャンセル日時:");
  });

  it("配送ステータスが正しく表示されること - 配達済み", async () => {
    await testShipmentStatus("delivered_at", 1620020000, "配達済み", "到着日時:");
  });

  it("商品情報がない場合、「商品情報はありません」と表示されること", async () => {
    await renderOrder({ paymentProducts: [] });

    expectTextsToExist(["購入商品", "商品情報はありません"]);
  });

  it("英語表示の場合、テキストが英語で表示されること", async () => {
    await renderOrder({ lang: "en" });

    expectTextsToExist(["Payment Details", "Shipment Information", "Purchased Products", "Status:", "Total Amount:"]);
  });
});
