import Image from "next/image";

export default function Home() {
  const products = [
    {
      id: 1,
      name: "エコノミー機内食",
      price: 24900,
      image: "image1.jpg",
    },
    {
      id: 2,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
    },
    {
      id: 3,
      name: "エコノミー機内食",
      price: 34500,
      image: "image1.jpg",
    },
    {
      id: 4,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
    },
    {
      id: 5,
      name: "エコノミー機内食",
      price: 5400,
      image: "image1.jpg",
    },
    {
      id: 6,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
    },
    {
      id: 7,
      name: "エコノミー機内食",
      price: 6500,
      image: "image1.jpg",
    },
    {
      id: 8,
      name: "おいしい給食",
      price: 4300,
      image: "image2.jpg",
    },
  ];
  return (
    <div className="w-[90%] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative pt-[100%]">
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 mb-2">{product.name}</h3>
              <p className="font-bold text-blue-700 text-right">¥ {product.price}</p>
              <button
                type="button"
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
              >
                購入
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
