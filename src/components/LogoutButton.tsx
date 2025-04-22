"use client";

import { useState } from "react";
import type { Lang } from "@/types";
import { useTranslation as t } from "@/lib/translations";

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
      className="block w-auto text-left px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer ml-auto mt-4 md:mt-0 relative"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <span className={isLoading ? "opacity-0" : ""}>{t(l).account.logout}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-red-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-labelledby="loadingIcon"
          >
            <title id="loadingIcon">Loading</title>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
