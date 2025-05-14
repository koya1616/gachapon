import EditAuctionPage from "@/app/admin/auctions/[id]/edit/page";
import { mockAuctionData, mockProducts } from "@/mocks/data";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

const params = { id: "1" };

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useParams: () => params,
}));

global.fetch = vi.fn();

describe("オークション編集ページ", () => {
  const setupComponent = () => {
    render(<EditAuctionPage />);
    expect(screen.getAllByTestId("loading")).toBeDefined();
  };

  const setupSuccessMocks = () => {
    vi.mocked(fetch).mockImplementation((url) => {
      if (url === "/api/auction/1") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: { auction: mockAuctionData[0], product: mockProducts[0] } }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockProducts }),
      } as Response);
    });
  };

  const validateApiCalls = async () => {
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, `/api/auction/${params.id}`);
      expect(global.fetch).toHaveBeenLastCalledWith("/api/product");
    });
  };

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.mocked(fetch).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("オークション編集画面が正しく表示されること", async () => {
    setupSuccessMocks();
    setupComponent();
    await validateApiCalls();

    expect(screen.getByText(`オークション編集 - ${mockAuctionData[0].name}`)).toBeDefined();
    expect(screen.getByLabelText("オークション名 *").getAttribute("value")).toBe(mockAuctionData[0].name);
    expect(screen.getByLabelText("説明").textContent).toBe(mockAuctionData[0].description);
    expect(screen.getByLabelText("開始日時 *").getAttribute("value")).toBe("2025-06-01T00:00");
    expect(screen.getByLabelText("終了日時 *").getAttribute("value")).toBe("2025-06-15T23:59");
    expect(screen.getByLabelText("支払期限 *").getAttribute("value")).toBe("2025-06-22T23:59");
    expect(screen.getByText("保存する")).toBeDefined();
  });

  it("inputの値が変更された場合、stateが更新されること", async () => {
    setupSuccessMocks();
    setupComponent();
    await validateApiCalls();

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "新しいオークション名" } });

    await waitFor(() => {
      expect(nameInput.getAttribute("value")).toBe("新しいオークション名");
    });

    const startAtInput = screen.getByLabelText("開始日時 *");
    fireEvent.change(startAtInput, { target: { value: "2026-06-01T00:00" } });

    await waitFor(() => {
      expect(startAtInput.getAttribute("value")).toBe("2026-06-01T00:00");
    });
  });

  it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({ status: 401 } as Response);
    });

    setupComponent();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("オークションデータの取得に失敗した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({ status: 500 } as Response);
    });

    setupComponent();

    await waitFor(() => {
      expect(screen.getByText("オークションデータの取得に失敗しました。")).toBeDefined();
    });
  });

  it("商品データの取得に失敗した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((url) => {
      if (url === "/api/auction/1") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: { auction: mockAuctionData[0], product: mockProducts[0] } }),
        } as Response);
      }
      return Promise.resolve({ status: 500 } as Response);
    });

    setupComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, `/api/auction/${params.id}`);
      expect(global.fetch).toHaveBeenLastCalledWith("/api/product");
      expect(screen.getByText("商品データの取得に失敗しました。")).toBeDefined();
    });
  });

  describe("handleSubmit機能", () => {
    beforeEach(() => {
      setupSuccessMocks();
      setupComponent();
    });

    it("正常にフォームが送信されると成功メッセージが表示されること", async () => {
      await validateApiCalls();

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url === `/api/auction/${params.id}` && options?.method === "PUT") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response);
      });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/auction/${params.id}`,
          expect.objectContaining({
            method: "PUT",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
            }),
            body: expect.any(String),
          }),
        );
        expect(
          screen.getByText("オークションが正常に更新されました。オークション一覧ページにリダイレクトします..."),
        ).toBeDefined();
      });
    });

    it("開始日時が終了日時より後の場合、エラーメッセージが表示されること", async () => {
      await validateApiCalls();

      const startAtInput = screen.getByLabelText("開始日時 *");
      const endAtInput = screen.getByLabelText("終了日時 *");

      fireEvent.change(startAtInput, { target: { value: "2025-06-20T00:00" } });
      fireEvent.change(endAtInput, { target: { value: "2025-06-15T23:59" } });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("開始日時は終了日時より前である必要があります")).toBeDefined();
      });
    });

    it("終了日時が支払期限より後の場合、エラーメッセージが表示されること", async () => {
      await validateApiCalls();

      const endAtInput = screen.getByLabelText("終了日時 *");
      const paymentDeadlineAtInput = screen.getByLabelText("支払期限 *");

      fireEvent.change(endAtInput, { target: { value: "2025-06-25T23:59" } });
      fireEvent.change(paymentDeadlineAtInput, { target: { value: "2025-06-22T23:59" } });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("終了日時は支払期限より前である必要があります")).toBeDefined();
      });
    });

    it("商品が選択されていない場合、エラーメッセージが表示されること", async () => {
      await validateApiCalls();

      const productSelect = screen.getByLabelText("商品 *");
      fireEvent.change(productSelect, { target: { value: "0" } });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("商品を選択してください")).toBeDefined();
      });
    });

    it("API更新に失敗した場合、エラーメッセージが表示されること", async () => {
      await validateApiCalls();

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url === `/api/auction/${params.id}` && options?.method === "PUT") {
          return Promise.resolve({
            ok: false,
            status: 500,
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response);
      });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("オークションの更新に失敗しました")).toBeDefined();
      });
    });

    it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
      await validateApiCalls();

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url === `/api/auction/${params.id}` && options?.method === "PUT") {
          return Promise.resolve({
            ok: false,
            status: 401,
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response);
      });

      const submitButton = screen.getByText("保存する");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
      });
    });
  });
});
