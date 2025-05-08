"use client";

import { useCallback, useState } from "react";
import type { Lang } from "@/types";
import { useTranslation as t } from "@/lib/translations";
import Loading from "@/components/Loading";

interface LogoutButtonLogic {
  l: Lang;
  isLoading: boolean;
  handleLogout: () => Promise<void>;
}

export const LogoutButtonView = ({ l, isLoading, handleLogout }: LogoutButtonLogic) => {
  if (isLoading) return <Loading />;
  return (
    <button
      type="button"
      className="block w-auto text-left px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer ml-auto md:mt-0 relative"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {t(l).account.logout}
    </button>
  );
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
