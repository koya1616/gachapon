import { USER_TOKEN } from "@/const/cookies";
import { createLotteryEntry, findProductById, getLotteryEventsByProductId } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductDetailClient from "./_view/ProductDetailClient";
import { revalidatePath } from "next/cache";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) => {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");

  const { lang, id } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const productId = Number(id);
  const product = await findProductById(productId);
  const lotteryEvents = await getLotteryEventsByProductId(productId);

  const handleLotteryEntry = async (lotteryEventId: number, lotteryProductId: number) => {
    "use server";
    if (!userToken) {
      return redirect(`/${l}/login`);
    }
    await createLotteryEntry(lotteryEventId, 111, lotteryProductId);
  };

  return (
    <ProductDetailClient
      product={product}
      lang={l}
      lotteryEvents={lotteryEvents}
      isLogin={!!userToken}
      createLotteryEntry={handleLotteryEntry}
    />
  );
};

export default ProductDetailPage;
