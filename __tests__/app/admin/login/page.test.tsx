import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Login from "@/app/admin/login/page";
import * as React from "react";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("管理者ログインページ", () => {
  const mockUseActionStateSuccess = () => {
    vi.mocked(React.useActionState).mockImplementation(() => {
      const dispatch = (formData: unknown) => {
        window.location.href = "/admin/top";
        return Promise.resolve({ success: true });
      };
      return [{ success: true }, dispatch as (formData: unknown) => Promise<{ success: boolean }>, false];
    });
  };

  const mockUseActionStateFailure = () => {
    vi.mocked(React.useActionState).mockImplementation(() => {
      const dispatch = (formData: unknown) => {
        return Promise.resolve({ success: false });
      };
      return [{ success: false }, dispatch as (formData: unknown) => Promise<{ success: boolean }>, false];
    });
  };

  const mockUseActionStatePending = () => {
    vi.mocked(React.useActionState).mockImplementation(() => {
      const dispatch = (formData: unknown) => {
        return Promise.resolve({ success: true });
      };
      return [{ success: true }, dispatch as (formData: unknown) => Promise<{ success: boolean }>, true];
    });
  };

  beforeEach(() => {
    cleanup();
    window.location.href = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ログインフォームが正しくレンダリングされること", () => {
    mockUseActionStateSuccess();
    render(<Login />);

    expect(screen.getByLabelText("パスワード")).toBeDefined();

    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeDefined();
    expect(loginButton.textContent).toBe("ログイン");
  });

  it("ログイン成功時、管理者トップページにリダイレクトすること", async () => {
    mockUseActionStateSuccess();
    render(<Login />);

    const input = screen.getByLabelText("パスワード");
    const loginButton = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "correct_code" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.location.href).toBe("/admin/top");
    });
  });

  it("ログイン失敗時、エラーメッセージが表示されること", () => {
    mockUseActionStateFailure();
    render(<Login />);

    expect(screen.getByText("ログインコードが無効です。")).toBeDefined();
  });

  it("ローディング中は、ボタンのテキストが「ログイン中...」と表示されること", () => {
    mockUseActionStatePending();
    render(<Login />);

    const loginButton = screen.getByRole("button");
    expect(loginButton.textContent).toBe("ログイン中...");
    expect(loginButton.getAttribute("disabled")).toBe("");
  });
});
