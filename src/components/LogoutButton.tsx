"use client";

import type { Lang } from "@/types";
import { useTranslation as t } from "@/lib/translations";

export default function LogoutButton({ lang }: { lang: Lang }) {
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout");
    if (response.ok) {
      window.location.href = `/${l}/login`;
    }
  };

  return (
    <button
      type="button"
      className="block w-auto text-left px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer ml-auto mt-4 md:mt-0"
      onClick={async () => {
        await handleLogout();
      }}
    >
      {t(l).account.logout}
    </button>
  );
}
