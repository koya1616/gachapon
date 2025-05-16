import { mockLotteryEvents, mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import View from "./View";

const meta = {
  title: "Pages/Product/id",
  component: View,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
    lang: "ja",
    lotteryEvents: mockLotteryEvents,
    lotteryEntries: [],
    isLogin: true,
    loadingEventId: null,
    successEventId: null,
    error: null,
    handleLotteryEntry: async (eventId) => {
      console.log(`Entry to lottery event ${eventId}`);
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loadingEventId: mockLotteryEvents[0].id,
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    successEventId: mockLotteryEvents[0].id,
  },
};

export const NotLoggedIn: Story = {
  args: {
    ...Default.args,
    isLogin: false,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "抽選への参加中にエラーが発生しました。もう一度お試しください。",
  },
};

export const NoProduct: Story = {
  args: {
    ...Default.args,
    product: null,
  },
};

export const NoLotteryEvents: Story = {
  args: {
    ...Default.args,
    lotteryEvents: [],
  },
};

export const LotteryEventFinished: Story = {
  args: {
    ...Default.args,
    lotteryEntries: [
      {
        id: 1,
        lottery_event_id: mockLotteryEvents[0].id,
        user_id: 1,
        lottery_product_id: mockProducts[0].id,
        result: 0,
        created_at: Date.now(),
      },
    ],
  },
};
