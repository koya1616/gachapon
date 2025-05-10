"use client";

import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { useTranslation as t } from "@/lib/translations";
import type { Lang } from "@/types";
import { useCallback, useState } from "react";

interface LogoutButtonLogic {
  l: Lang;
  isLoading: boolean;
  handleLogout: () => Promise<void>;
}

export const LogoutButtonView = ({ l, isLoading, handleLogout }: LogoutButtonLogic) => {
  if (isLoading) return <Loading />;
  return <Button label={t(l).account.logout} onClick={handleLogout} color="red" />;
};

const useLogoutButton = (lang: Lang): LogoutButtonLogic => {
  const [isLoading, setIsLoading] = useState(false);
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await fetch("/api/auth/logout").finally(() => {
      window.location.href = `/${l}/login`;
    });
  }, [l]);

  return {
    l,
    isLoading,
    handleLogout,
  };
};

const LogoutButton = ({ lang }: { lang: Lang }) => {
  return <LogoutButtonView {...useLogoutButton(lang)} />;
};

export default LogoutButton;
