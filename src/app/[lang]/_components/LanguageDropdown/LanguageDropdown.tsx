"use client";

import { Button } from "@/components/Button";
import { LanguageIcon } from "@/components/Icons";
import { LANGS } from "@/const/language";
import type { Lang } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";

interface LanguageDropdownLogic {
  isDropdownOpen: boolean;
  lang: Lang;
  handleLanguageChange: (lang: Lang) => void;
  toggleDropdown: () => void;
}

export const LanguageDropdownView = ({
  isDropdownOpen,
  lang,
  handleLanguageChange,
  toggleDropdown,
}: LanguageDropdownLogic) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center w-11 h-11 justify-between p-2 text-sm border border-neutral-200 rounded-md bg-white cursor-pointer"
      >
        <LanguageIcon />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-neutral-200 rounded-md shadow-lg z-10">
          {LANGS.map((langOption) => (
            <Button
              key={langOption}
              label={langOption.toUpperCase()}
              onClick={() => handleLanguageChange(langOption as Lang)}
              color={lang === langOption ? "blue" : "gray"}
              width="w-full"
              variant={lang === langOption ? "tonal" : "text"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const useLanguageDropdown = (lang: Lang): LanguageDropdownLogic => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = useCallback(
    (newLang: Lang) => {
      if (newLang === lang) {
        setIsDropdownOpen(false);
        return;
      }

      setIsDropdownOpen(false);
      const pathSegments = pathname.split("/");

      if (pathSegments.length > 1) {
        pathSegments[1] = newLang;
      } else {
        pathSegments.push(newLang);
      }

      router.push(pathSegments.join("/"));
    },
    [pathname, router, lang],
  );

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  return {
    isDropdownOpen,
    lang,
    handleLanguageChange,
    toggleDropdown,
  };
};

const LanguageDropdown = ({ lang }: { lang: Lang }) => {
  return <LanguageDropdownView {...useLanguageDropdown(lang)} />;
};

export default React.memo(LanguageDropdown);
