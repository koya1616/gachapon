import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, renderHook, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import { CART } from "@/const/sessionStorage";

const mockProducts: Product[] = [
  { id: 1, name: "商品1", price: 1000, image: "image1.jpg", quantity: 0, stock_quantity: 10 },
  { id: 2, name: "商品2", price: 2000, image: "image2.jpg", quantity: 0, stock_quantity: 5 },
];

const TestComponent = () => {
  const {
    cart,
    isCartOpen,
    totalPrice,
    add_to_cart,
    removeFromCart,
    updateQuantity,
    clear_cart,
    toggleCart,
    closeCart,
  } = useCart();

  return (
    <div>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="cart-open">{isCartOpen ? "open" : "closed"}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <button type="button" data-testid="add-product-1" onClick={() => add_to_cart(mockProducts[0])}>
        Add Product 1
      </button>
      <button type="button" data-testid="add-product-2" onClick={() => add_to_cart(mockProducts[1])}>
        Add Product 2
      </button>
      <button type="button" data-testid="remove-product-1" onClick={() => removeFromCart(1)}>
        Remove Product 1
      </button>
      <button type="button" data-testid="update-quantity-1" onClick={() => updateQuantity(1, 3)}>
        Update Quantity
      </button>
      <button type="button" data-testid="update-quantity-2" onClick={() => updateQuantity(1, 0)}>
        Update Quantity
      </button>
      <button type="button" data-testid="clear-cart" onClick={clear_cart}>
        Clear Cart
      </button>
      <button type="button" data-testid="toggle-cart" onClick={toggleCart}>
        Toggle Cart
      </button>
      <button type="button" data-testid="close-cart" onClick={closeCart}>
        Close Cart
      </button>
      {cart.map((item) => (
        <div key={item.id} data-testid={`product-${item.id}`}>
          <span data-testid={`product-${item.id}-name`}>{item.name}</span>
          <span data-testid={`product-${item.id}-quantity`}>{item.quantity}</span>
          <span data-testid={`product-${item.id}-price`}>{item.price}</span>
        </div>
      ))}
    </div>
  );
};

describe("CartContext", () => {
  let sessionStorageMock: Record<string, string> = {};

  beforeEach(() => {
    cleanup();
    sessionStorageMock = {};

    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => ({
      getItem: (key: string) => sessionStorageMock[key] || null,
      setItem: (key: string, value: string) => {
        sessionStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete sessionStorageMock[key];
      },
      clear: () => {
        sessionStorageMock = {};
      },
      length: Object.keys(sessionStorageMock).length,
      key: (index: number) => Object.keys(sessionStorageMock)[index] || null,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("初期状態でカートが空であること", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("0");
    expect(screen.getByTestId("cart-open").textContent).toBe("closed");
    expect(screen.getByTestId("total-price").textContent).toBe("0");
  });

  it("sessionStorageから保存されたカートデータを読み込むこと", async () => {
    const savedCart = [{ ...mockProducts[0], quantity: 2 }];
    sessionStorageMock[CART] = JSON.stringify(savedCart);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("1");
    expect(screen.getByTestId("product-1-quantity").textContent).toBe("2");
    expect(screen.getByTestId("total-price").textContent).toBe("2000");
  });

  it("カートに商品を追加できること", async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await user.click(screen.getByTestId("add-product-1"));

    expect(screen.getByTestId("cart-length").textContent).toBe("1");
    expect(screen.getByTestId("product-1-quantity").textContent).toBe("1");
    expect(screen.getByTestId("total-price").textContent).toBe("1000");

    await user.click(screen.getByTestId("add-product-1"));

    expect(screen.getByTestId("cart-length").textContent).toBe("1");
    expect(screen.getByTestId("product-1-quantity").textContent).toBe("2");
    expect(screen.getByTestId("total-price").textContent).toBe("2000");

    await user.click(screen.getByTestId("add-product-2"));

    expect(screen.getByTestId("cart-length").textContent).toBe("2");
    expect(screen.getByTestId("product-2-quantity").textContent).toBe("1");
    expect(screen.getByTestId("total-price").textContent).toBe("4000");

    expect(JSON.parse(sessionStorageMock[CART]).length).toBe(2);
  });

  it("カートから商品を削除できること", async () => {
    const user = userEvent.setup();

    sessionStorageMock[CART] = JSON.stringify([
      { ...mockProducts[0], quantity: 1 },
      { ...mockProducts[1], quantity: 1 },
    ]);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("2");

    await user.click(screen.getByTestId("remove-product-1"));

    expect(screen.getByTestId("cart-length").textContent).toBe("1");
    expect(screen.queryByTestId("product-1")).toBeNull();
    expect(screen.getByTestId("total-price").textContent).toBe("2000");
  });

  it("商品の数量を更新できること", async () => {
    const user = userEvent.setup();

    sessionStorageMock[CART] = JSON.stringify([{ ...mockProducts[0], quantity: 1 }]);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await user.click(screen.getByTestId("update-quantity-1"));

    expect(screen.getByTestId("product-1-quantity").textContent).toBe("3");
    expect(screen.getByTestId("total-price").textContent).toBe("3000");
  });

  it("数量を0に設定すると商品がカートから削除されること", async () => {
    const user = userEvent.setup();

    sessionStorageMock[CART] = JSON.stringify([{ ...mockProducts[0], quantity: 2 }]);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("1");

    await user.click(screen.getByTestId("update-quantity-2"));

    expect(screen.getByTestId("cart-length").textContent).toBe("0");
    expect(screen.queryByTestId("product-1")).toBeNull();
  });

  it("カートをクリアできること", async () => {
    const user = userEvent.setup();

    sessionStorageMock[CART] = JSON.stringify([
      { ...mockProducts[0], quantity: 1 },
      { ...mockProducts[1], quantity: 2 },
    ]);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("2");

    await user.click(screen.getByTestId("clear-cart"));

    expect(screen.getByTestId("cart-length").textContent).toBe("0");
    expect(screen.queryByTestId("product-1")).toBeNull();
    expect(screen.queryByTestId("product-2")).toBeNull();
    expect(screen.getByTestId("total-price").textContent).toBe("0");
  });

  it("カートの表示・非表示を切り替えられること", async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-open").textContent).toBe("closed");

    await user.click(screen.getByTestId("toggle-cart"));

    expect(screen.getByTestId("cart-open").textContent).toBe("open");

    await user.click(screen.getByTestId("toggle-cart"));

    expect(screen.getByTestId("cart-open").textContent).toBe("closed");

    await user.click(screen.getByTestId("toggle-cart"));
    expect(screen.getByTestId("cart-open").textContent).toBe("open");

    await user.click(screen.getByTestId("close-cart"));
    expect(screen.getByTestId("cart-open").textContent).toBe("closed");
  });

  it("sessionStorageからのJSONが不正な場合にエラーハンドリングすること", () => {
    sessionStorageMock[CART] = "invalid-json";

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    expect(screen.getByTestId("cart-length").textContent).toBe("0");

    expect(sessionStorageMock[CART]).toBeUndefined();
  });
});
