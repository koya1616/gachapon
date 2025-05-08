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
  removeFromCart: () => {},
  updateQuantity: () => {},
  clear_cart: () => {},
  toggleCart: () => {},
  closeCart: () => {},
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
    (Story) => {
      return (
        <CartContext.Provider value={mockCartContext}>
          <Story />
        </CartContext.Provider>
      );
    },
  ],
};

export default preview;
