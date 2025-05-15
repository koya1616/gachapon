import { findProductById } from "@/lib/db";
import ProductDetailView from "./_components/PageView/ProductDetailView";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) => {
  const { lang, id } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const productId = Number(id);
  const product = await findProductById(productId);

  return <ProductDetailView product={product} lang={l} />;
};

export default ProductDetailPage;
