import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressForm from "@/app/[lang]/_components/AddressForm";
import type { Address } from "@/types";
import { COUNTRY_LIST } from "@/const/country";

global.fetch = vi.fn();

Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

const mockSuccessResponse = (data: Address | null = null) => {
  return vi.mocked(fetch).mockResolvedValueOnce({
    status: 200,
    json: () => Promise.resolve({ data }),
  } as Response);
};

const mockErrorResponse = (status: number) => {
  return vi.mocked(fetch).mockResolvedValueOnce({
    status,
    json: () => Promise.resolve({}),
  } as Response);
};

const mockRejectedResponse = (error: Error = new Error("API error")) => {
  return vi.mocked(fetch).mockRejectedValueOnce(error);
};

describe("AddressFormコンポーネント", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockAddress: Address = {
    id: 1,
    user_id: 2,
    name: "山田太郎",
    country: "JP",
    postal_code: "123-4567",
    address: "東京都渋谷区代々木1-1-1",
  };

  it("コンポーネントが正しくレンダリングされること", async () => {
    mockSuccessResponse(null);

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    expect(screen.getByLabelText("国を選択")).toBeDefined();
    expect(screen.getByLabelText("氏名")).toBeDefined();
    expect(screen.getByLabelText("郵便番号")).toBeDefined();
    expect(screen.getByLabelText("住所")).toBeDefined();
    expect(screen.getByRole("button", { name: "クリア" })).toBeDefined();
    expect(screen.getByRole("button", { name: "登録" })).toBeDefined();

    const countrySelect = screen.getByLabelText("国を選択") as HTMLSelectElement;
    expect(countrySelect.options.length).toBe(COUNTRY_LIST.length);
  });

  it("英語表示の場合、ラベルが英語で表示されること", async () => {
    mockSuccessResponse(null);

    render(<AddressForm lang="en" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    expect(screen.getByLabelText("Select Country")).toBeDefined();
    expect(screen.getByLabelText("Recipient Name")).toBeDefined();
    expect(screen.getByLabelText("Postal Code")).toBeDefined();
    expect(screen.getByLabelText("Address")).toBeDefined();
    expect(screen.getByRole("button", { name: "Clear" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Register" })).toBeDefined();
  });

  it("住所データがAPIから取得されて表示されること", async () => {
    mockSuccessResponse(mockAddress);

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    expect((screen.getByLabelText("国を選択") as HTMLSelectElement).value).toBe("albania");
    expect((screen.getByLabelText("氏名") as HTMLInputElement).value).toBe(mockAddress.name);
    expect((screen.getByLabelText("郵便番号") as HTMLInputElement).value).toBe(mockAddress.postal_code);
    expect((screen.getByLabelText("住所") as HTMLInputElement).value).toBe(mockAddress.address);
  });

  it("フォームに入力して送信すると、APIが呼び出されること", async () => {
    const user = userEvent.setup();
    mockSuccessResponse(null);
    mockSuccessResponse(mockAddress);

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    await user.selectOptions(screen.getByLabelText("国を選択"), "albania");
    await user.type(screen.getByLabelText("氏名"), "山田太郎");
    await user.type(screen.getByLabelText("郵便番号"), "123-4567");
    await user.type(screen.getByLabelText("住所"), "東京都渋谷区代々木1-1-1");

    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 0,
        user_id: 0,
        name: "山田太郎",
        country: "albania",
        postal_code: "123-4567",
        address: "東京都渋谷区代々木1-1-1",
      }),
    });
  });

  it("クリアボタンをクリックすると、フォームがリセットされること", async () => {
    const user = userEvent.setup();
    mockSuccessResponse(mockAddress);

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    expect((screen.getByLabelText("氏名") as HTMLInputElement).value).toBe("山田太郎");

    await user.click(screen.getByRole("button", { name: "クリア" }));

    expect((screen.getByLabelText("国を選択") as HTMLSelectElement).value).toBe("albania");
    expect((screen.getByLabelText("氏名") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("郵便番号") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("住所") as HTMLInputElement).value).toBe("");

    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/address",
      expect.objectContaining({
        body: JSON.stringify({
          id: 1,
          user_id: 2,
          name: "",
          country: "",
          postal_code: "",
          address: "",
        }),
      }),
    );
  });

  it("APIエラーが発生した場合にアラートが表示されること", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    mockSuccessResponse(null);
    mockRejectedResponse();

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    await user.selectOptions(screen.getByLabelText("国を選択"), "japan");
    await user.type(screen.getByLabelText("氏名"), "山田太郎");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(alertMock).toHaveBeenCalledWith("保存に失敗しました。再度お試しください。");
  });

  it("認証エラー(401)の場合、ログインページにリダイレクトされること", async () => {
    const user = userEvent.setup();

    mockErrorResponse(401);

    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(window.location.href).toBe("/ja/login");
    });

    window.location.href = "";
    mockSuccessResponse(null);
    mockErrorResponse(401);

    cleanup();
    render(<AddressForm lang="ja" />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    await user.selectOptions(screen.getByLabelText("国を選択"), "japan");
    await user.type(screen.getByLabelText("氏名"), "山田太郎");
    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/ja/login");
    });
  });
});
