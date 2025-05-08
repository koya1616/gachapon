import React from "react";
import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import type { Product } from "../src/types";
import { CartContext } from "../src/context/CartContext";

const mockCartContext = {
  cart: [],
  isCartOpen: false,
  totalPrice: 0,
  add_to_cart: (product: Product) => console.log("add_to_cart", product),
  removeFromCart: (productId: number) => console.log("removeFromCart", productId),
  updateQuantity: (productId: number, quantity: number) => console.log("updateQuantity", productId, quantity),
  clear_cart: () => console.log("clear_cart"),
  toggleCart: () => console.log("toggleCart"),
  closeCart: () => console.log("closeCart"),
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, { parameters }) => {
      const { context }: { context?: "cart" } = parameters;
      if (context === "cart") {
        return (
          <CartContext.Provider value={mockCartContext}>
            <Story />
          </CartContext.Provider>
        );
      }
      return <Story />;
    },
  ],
};

export default preview;
