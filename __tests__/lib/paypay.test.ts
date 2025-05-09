import { type PaypayQRCodeCreateRequest, paypayGetCodePaymentDetails, paypayQRCodeCreate } from "@/lib/paypay";
import PAYPAY from "@paypayopa/paypayopa-sdk-node";
import type { HttpsClientSuccess } from "@paypayopa/paypayopa-sdk-node/dist/lib/httpsClient";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@paypayopa/paypayopa-sdk-node", () => ({
  default: {
    Configure: vi.fn(),
    QRCodeCreate: vi.fn(),
    GetCodePaymentDetails: vi.fn(),
  },
}));

describe("PayPay Utilities", () => {
  const mockQRCodeResponse = {
    STATUS: 200,
    BODY: {
      data: {
        url: "https://example.com/paypay/qr",
      },
    },
  };

  const mockPaymentDetailsResponse = {
    STATUS: 200,
    BODY: {
      data: {
        status: "COMPLETED",
        requestedAt: 1683000000,
        acceptedAt: 1683000100,
        amount: {
          amount: 2000,
        },
      },
    },
  };

  const createBasicTestData = (): PaypayQRCodeCreateRequest => ({
    merchantPaymentId: "test-payment-id",
    orderItems: [
      {
        name: "Product Name",
        quantity: 1,
        productId: "product-id",
        unitPrice: {
          amount: 1000,
          currency: "JPY",
        },
      },
    ],
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("paypayQRCodeCreate", () => {
    it("QRコード作成が成功した場合、レスポンスを返すこと", async () => {
      vi.mocked(PAYPAY.QRCodeCreate).mockResolvedValue(mockQRCodeResponse as HttpsClientSuccess);

      const testData: PaypayQRCodeCreateRequest = {
        merchantPaymentId: "test-payment-id",
        orderItems: [
          createBasicTestData().orderItems[0],
          {
            name: "Another Product",
            quantity: 2,
            productId: "another-product-id",
            unitPrice: {
              amount: 500,
              currency: "JPY",
            },
          },
        ],
      };

      const result = await paypayQRCodeCreate(testData);

      expect(result).not.toBeNull();
      expect(result?.data.url).toBe("https://example.com/paypay/qr");
      expect(PAYPAY.QRCodeCreate).toHaveBeenCalledTimes(1);
      expect(PAYPAY.QRCodeCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantPaymentId: "test-payment-id",
          amount: {
            amount: 2000,
            currency: "JPY",
          },
          codeType: "ORDER_QR",
          orderItems: testData.orderItems,
          orderDescription: "Product Name x1, Another Product x2",
        }),
      );
    });

    it("商品説明が長い場合、200文字でトリミングされること", async () => {
      vi.mocked(PAYPAY.QRCodeCreate).mockResolvedValue(mockQRCodeResponse as HttpsClientSuccess);

      const longItemName = "超長い商品名だよ".repeat(30);
      const testData: PaypayQRCodeCreateRequest = {
        merchantPaymentId: "test-payment-id",
        orderItems: [
          {
            name: longItemName,
            quantity: 1,
            productId: "product-id",
            unitPrice: {
              amount: 1000,
              currency: "JPY",
            },
          },
        ],
      };

      await paypayQRCodeCreate(testData);

      expect(PAYPAY.QRCodeCreate).toHaveBeenCalledTimes(1);
      expect(PAYPAY.QRCodeCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          orderDescription: `${longItemName.substring(0, 190)}...`,
        }),
      );
    });

    it("QRコード作成が失敗した場合、nullを返すこと", async () => {
      vi.mocked(PAYPAY.QRCodeCreate).mockResolvedValue({
        STATUS: 400,
        ERROR: "Bad Request",
      });

      const result = await paypayQRCodeCreate(createBasicTestData());

      expect(result).toBeNull();
    });
  });

  describe("paypayGetCodePaymentDetails", () => {
    it("支払い詳細の取得が成功した場合、レスポンスを返すこと", async () => {
      vi.mocked(PAYPAY.GetCodePaymentDetails).mockResolvedValue(mockPaymentDetailsResponse as HttpsClientSuccess);

      const merchantPaymentId = "test-payment-id";
      const result = await paypayGetCodePaymentDetails(merchantPaymentId);

      expect(result).not.toBeNull();
      expect(result?.data.status).toBe("COMPLETED");
      expect(result?.data.amount.amount).toBe(2000);
      expect(PAYPAY.GetCodePaymentDetails).toHaveBeenCalledTimes(1);
      expect(PAYPAY.GetCodePaymentDetails).toHaveBeenCalledWith([merchantPaymentId]);
    });

    it("支払い詳細の取得が失敗した場合、nullを返すこと", async () => {
      vi.mocked(PAYPAY.GetCodePaymentDetails).mockResolvedValue({
        STATUS: 404,
        ERROR: "Payment Not Found",
      });

      const result = await paypayGetCodePaymentDetails("non-existent-payment-id");

      expect(result).toBeNull();
    });
  });
});
