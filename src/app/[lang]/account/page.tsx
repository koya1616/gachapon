import { cookies } from "next/headers";
import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { getPaypayPaymentsByUserId } from "@/lib/db";
import AccountPageView from "./_components/PageView";

const useAccountPageLogic = async (userId: number) => {
  const orders = await getPaypayPaymentsByUserId(userId);

  return { orders };
};

const AccountPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return redirect(`/${l}/login`);
  }

  const logic = await useAccountPageLogic(userToken.id);
  return <AccountPageView {...logic} l={l} />;
};

export default AccountPage;
