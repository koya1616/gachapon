import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import type { Lang } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import LoginPageView from "./_components/PageView";

export interface LoginPageLogic {
  l: Lang;
}

const useLoginPage = async (l: Lang): Promise<LoginPageLogic> => {
  return { l };
};

const LoginPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");

  if (userToken) {
    return redirect(`/${l}`);
  }

  const logic = await useLoginPage(l);

  return <LoginPageView {...logic} />;
};

export default LoginPage;
