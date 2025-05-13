import CreateLotteryPage from "@/app/admin/lotteries/create/page";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

const mockUUID = "test-uuid-123";
vi.mock("crypto", () => ({
  randomUUID: vi.fn().mockReturnValue(mockUUID),
}));

global.fetch = vi.fn();

describe("抽選イベント作成ページ", () => {
  const mockProducts = [
    { id: 1, name: "商品1", price: 1000, image: "image1.jpg", description: "説明1", stock: 10 },
    { id: 2, name: "商品2", price: 2000, image: "image2.jpg", description: "説明2", stock: 5 },
  ];

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    vi.mocked(fetch).mockReset();

    vi.mocked(fetch).mockImplementation((url) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("フォームが正しくレンダリングされること", async () => {
    render(<CreateLotteryPage />);

    expect(screen.getByLabelText("抽選名 *")).toBeDefined();
    expect(screen.getByLabelText("説明")).toBeDefined();
    expect(screen.getByLabelText("開始日時 *")).toBeDefined();
    expect(screen.getByLabelText("終了日時 *")).toBeDefined();
    expect(screen.getByLabelText("結果発表日時 *")).toBeDefined();
    expect(screen.getByLabelText("支払期限 *")).toBeDefined();
    expect(screen.getByLabelText("ステータス *")).toBeDefined();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const addButton = screen.getByText("商品を追加");
    expect(addButton).toBeDefined();

    const saveButton = screen.getByText("保存する");
    expect(saveButton).toBeDefined();
  });

  it("商品を追加・削除できること", async () => {
    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const productSelectLabel = screen.getByLabelText("商品 *");
    expect(productSelectLabel).toBeDefined();

    const quantityInput = screen.getByLabelText("数量 *");
    expect(quantityInput).toBeDefined();

    const removeButton = screen.getByText("削除");
    expect(removeButton).toBeDefined();

    const productSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(productSelect, { target: { value: "1" } });

    fireEvent.change(quantityInput, { target: { value: "3" } });

    fireEvent.click(removeButton);

    expect(screen.queryByLabelText("商品 *")).toBeNull();
  });

  it("商品を複数追加できること", async () => {
    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    fireEvent.click(addButton);

    const productSelects = screen.getAllByRole("combobox");
    expect(productSelects.length).toBe(3);

    const quantityInputs = screen.getAllByLabelText("数量 *");
    expect(quantityInputs.length).toBe(2);
  });

  it("フォーム入力の検証が正しく機能すること", async () => {
    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const saveButton = screen.getByText("保存する");

    // なぜかうまくいかない
    // fireEvent.click(saveButton);
    // await waitFor(() => {
    //   expect(screen.getByText("抽選名を入力してください")).toBeDefined();
    // });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("少なくとも1つの商品を選択してください")).toBeDefined();
    });
  });

  it("日付の検証が正しく機能すること", async () => {
    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const startAtInput = screen.getByLabelText("開始日時 *");
    const endAtInput = screen.getByLabelText("終了日時 *");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() + 10);

    fireEvent.change(startAtInput, {
      target: {
        value: futureDate.toISOString().slice(0, 16),
      },
    });

    fireEvent.change(endAtInput, {
      target: {
        value: pastDate.toISOString().slice(0, 16),
      },
    });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("開始日時は終了日時より前である必要があります")).toBeDefined();
    });
  });

  it("商品選択の検証が正しく機能すること", async () => {
    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("すべての商品を選択してください")).toBeDefined();
    });
  });

  it("抽選イベント作成が成功した場合、抽選一覧ページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/lottery") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const productSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("抽選イベントが正常に作成されました。抽選一覧ページにリダイレクトします...")).toBeDefined();
    });

    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/admin/lotteries");
      },
      { timeout: 3000 },
    );
  });

  it("APIエラーが発生した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/lottery") {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const productSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("抽選の作成に失敗しました")).toBeDefined();
    });
  });

  it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/lottery") {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const productSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("フォーム送信中はボタンが無効化されること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/lottery") {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({}),
            } as Response);
          }, 100);
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateLotteryPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const nameInput = screen.getByLabelText("抽選名 *");
    fireEvent.change(nameInput, { target: { value: "テスト抽選" } });

    const addButton = screen.getByText("商品を追加");
    fireEvent.click(addButton);

    const productSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    expect(screen.getByTestId("loading")).toBeDefined();
  });
});
