import { mockProducts } from "@/mocks/data";
import type { Product } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import Table from "./Table";

const columns = [
  {
    header: "ID",
    accessor: (item: Product) => item.id,
  },
  {
    header: "商品名",
    accessor: (item: Product) => item.name,
  },
  {
    header: "画像",
    accessor: (item: Product) => <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />,
  },
  {
    header: "価格",
    accessor: (item: Product) => item.price,
  },
  {
    header: "在庫",
    accessor: (item: Product) => item.stock_quantity,
  },
  {
    header: "",
    accessor: (item: Product) => (
      <a href={`/admin/products/${item.id}`} className="text-blue-600 hover:text-blue-900">
        詳細
      </a>
    ),
  },
];

const meta = {
  title: "Components/Table",
  component: Table<Product>,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockProducts,
    columns: columns,
    keyExtractor: (item: Product) => item.id,
  },
};
