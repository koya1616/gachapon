"use client";

import { Button } from "@/components/Button";
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
        className="flex items-center justify-between p-2 text-sm border border-neutral-200 rounded-md bg-white cursor-pointer"
      >
        <svg
          className="size-6 fill-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
        </svg>
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
