import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import type { Lang } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupPageView from "./_components/PageView";

export interface SignupPageLogic {
  l: Lang;
}

const SignupPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (userToken) {
    return redirect(`/${lang}`);
  }

  return <SignupPageView l={l} />;
};

export default SignupPage;
