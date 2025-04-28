import { createProducts } from "@/lib/db";

export class ProductFactory {
  id: number;
  name: string;
  price: number;
  image: string;
  stock_quantity: number;

  constructor(name: string, price: number, image: string, stock_quantity?: number) {
    this.id = 0;
    this.name = name;
    this.price = price;
    this.image = image;
    this.stock_quantity = stock_quantity || 1;
  }

  public static async create(name?: string, price?: number, image?: string): Promise<ProductFactory> {
    const product = await createProducts({ name: name || "商品1", price: price || 100, image: image || "test.jpg" });
    const factory = new ProductFactory(product.name, product.price, product.image);
    factory.id = product.id;
    return factory;
  }
}
