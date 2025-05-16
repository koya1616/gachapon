import { USER_TOKEN } from "@/const/cookies";
import {
  createLotteryEntry,
  findProductById,
  getLotteryEntriesByUserIdAndProductId,
  getLotteryEventsByProductId,
} from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logic from "./_components/Logic";

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
  const lotteryEntries = userToken ? await getLotteryEntriesByUserIdAndProductId(userToken.id, productId) : [];

  const handleLotteryEntry = async (lotteryEventId: number) => {
    "use server";
    if (!userToken) {
      return redirect(`/${l}/login`);
    }
    await createLotteryEntry(lotteryEventId, userToken.id, productId);
    revalidatePath(`/${l}/product/${productId}`);
  };

  return (
    <Logic
      product={product}
      lang={l}
      lotteryEvents={lotteryEvents}
      lotteryEntries={lotteryEntries}
      isLogin={!!userToken}
      createLotteryEntry={handleLotteryEntry}
    />
  );
};

export default ProductDetailPage;
