"use client";

import { useState } from "react";
import type { Lang } from "@/types";
import { useTranslation as t } from "@/lib/translations";
import ButtonLoading from "./ButtonLoading";

export default function LogoutButton({ lang }: { lang: Lang }) {
  const [isLoading, setIsLoading] = useState(false);
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout");
      if (response.ok) {
        window.location.href = `/${l}/login`;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="block w-auto text-left px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer ml-auto md:mt-0 relative"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? <ButtonLoading color="red" /> : <span>{t(l).account.logout}</span>}
    </button>
  );
}
