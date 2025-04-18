import type { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const products: Product[] = [
    {
      id: 1,
      name: "エコノミー機内食",
      price: 777,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/airline_food.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "おいしい給食",
      price: 1200,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/school_lunch.jpg",
      quantity: 1,
    },
    {
      id: 3,
      name: "定番お惣菜",
      price: 1000,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/teibann_osouzai.jpg",
      quantity: 1,
    },
    {
      id: 4,
      name: "魔女の宅急便",
      price: 10000,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/kikis_delivery_service.jpeg",
      quantity: 1,
    },
    {
      id: 5,
      name: "鳥貴族",
      price: 600,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/torikizoku.jpeg",
      quantity: 1,
    },
    {
      id: 6,
      name: "遠足の思い出",
      price: 300,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/bento_box_lunch.jpg",
      quantity: 1,
    },
    {
      id: 7,
      name: "無印良品",
      price: 400,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/muji.jpg",
      quantity: 1,
    },
    {
      id: 8,
      name: "アイスクリーム",
      price: 500,
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/ice_cream.jpg",
      quantity: 1,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
