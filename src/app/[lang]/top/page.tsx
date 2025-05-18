import { getProducts } from "@/lib/db";
import Image from "next/image";

const TopPage = async () => {
  const allProducts = await getProducts();
  const products = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <section className="relative min-h-[100vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 rounded-full bg-pink-200 opacity-30 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 rounded-full bg-blue-200 opacity-30 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-44 sm:w-56 md:w-72 h-44 sm:h-56 md:h-72 rounded-full bg-purple-200 opacity-30 blur-3xl" />

          <div className="fade-in-simple absolute top-1/3 left-1/5 w-20 h-20 border-4 border-pink-300/30 rounded-full" />
          <div className="animate-bounce absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-400/40 rounded-full" />
          <div className="animate-bounce delay-150 absolute bottom-1/4 left-1/4 w-2 h-2 bg-pink-400/40 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 animate-fade-in max-w-full w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold mb-4 md:mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 animate-shine bg-[length:200%_100%]">
              ガチャポン
            </span>
            <span className="inline-block ml-2">✨</span>
          </h1>
          <div className="overflow-hidden">
            <p className="text-xl sm:text-2xl md:text-3xl font-light mb-6 md:mb-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto animate-slide-up text-gray-600 px-2">
              あなただけの<span className="animate-pulse text-red-500 font-medium">特別なコレクション</span>
              を見つけよう。
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute -top-10 right-0 w-40 h-40 opacity-10 animate-spin-slow">
          <div className="absolute w-full h-full rounded-full border-8 border-dashed border-pink-300" />
        </div>
        <div
          className="absolute -bottom-10 left-0 w-32 h-32 opacity-10 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "15s" }}
        >
          <div className="absolute w-full h-full rounded-full border-8 border-dashed border-blue-300" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-center animate-slide-up">
          <span className="relative inline-block">
            <span className="absolute inset-0 flex items-center justify-center -z-10 animate-ping-slow opacity-30">
              <svg
                className="w-8 h-8 text-pink-300"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                aria-label="星のアイコン"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
              人気コレクション
            </span>
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-gray-50 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-xl hover:scale-105 ${index % 3 === 0 ? "animate-fade-in" : index % 3 === 1 ? "animate-fade-in-delayed" : "animate-fade-in-delayed-2"}`}
              style={{
                animationDelay: `${index * 0.15}s`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                <div
                  className="absolute inset-0 animate-pulse-slow opacity-0 group-hover:opacity-30 bg-gradient-to-r from-pink-300/30 to-blue-300/30 z-10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    type="button"
                    className="w-full py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm sm:text-base font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-800 line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 relative">
              ガチャポンの魅力
              <span className="absolute -top-6 -right-6 text-lg sm:text-2xl animate-pulse-slow text-pink-500">✨</span>
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {[
              {
                id: "feature-1",
                title: "レアアイテムをゲット",
                description:
                  "世界中で限定販売されているレアなアイテムを手に入れるチャンス。希少価値の高いコレクションを集めよう。",
                icon: "✨",
              },
              {
                id: "feature-2",
                title: "サプライズの喜び",
                description: "何が出るかわからない、ドキドキとワクワクを体験。開ける瞬間の高揚感はガチャポンならでは。",
                icon: "🎁",
              },
              {
                id: "feature-3",
                title: "世界中から厳選",
                description: "日本を始め、世界各国から厳選された高品質なフィギュアやコレクションアイテムをお届け。",
                icon: "🌏",
              },
            ].map((feature) => (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:rotate-1 relative overflow-hidden"
                style={{
                  animationDelay: `${Number.parseInt(feature.id.split("-")[1]) * 0.2}s`,
                }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 via-transparent to-blue-200 opacity-0 group-hover:opacity-100 blur-xl group-hover:animate-shine transition-opacity duration-700 -z-10" />

                <div className="relative mb-4 sm:mb-6">
                  <div className="text-4xl sm:text-5xl animate-wiggle transition-all duration-300 group-hover:scale-125 inline-block">
                    {feature.icon}
                  </div>
                  <div
                    className={
                      "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400/20 to-blue-400/20 animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    }
                    style={{ animationDelay: `${Number.parseInt(feature.id.split("-")[1]) * 0.3}s` }}
                  />
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 animate-slide-in-left"
                  style={{ animationDelay: `${Number.parseInt(feature.id.split("-")[1]) * 0.3}s` }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-gray-600 leading-relaxed animate-fade-in"
                  style={{ animationDelay: `${Number.parseInt(feature.id.split("-")[1]) * 0.4}s` }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TopPage;
