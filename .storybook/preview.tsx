import type { Preview } from "@storybook/nextjs";
import "../src/app/globals.css";
import { withActions } from "storybook/actions/decorator";
import { CartContext } from "../src/context/CartContext";
import { mockCartContext } from "../src/mocks/data";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: {
      handles: ["click button"],
    },
  },
  decorators: [
    withActions,
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
