"use client";

import { Button } from "@/components/Button";
import { LANGS } from "@/const/language";
import type { Lang } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useCallback, useMemo } from "react";

interface LanguageDropdownLogic {
  lang: Lang;
  dropdownOptions: React.ReactNode;
  dropdownIcon: React.ReactNode;
  toggleDropdown: () => void;
}

export const LanguageDropdownView = ({
  lang,
  dropdownOptions,
  dropdownIcon,
  toggleDropdown,
}: LanguageDropdownLogic) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-20 px-3 py-2 text-sm border border-neutral-200 rounded-md bg-white cursor-pointer"
      >
        {lang.toUpperCase()}
        {dropdownIcon}
      </button>
      {dropdownOptions}
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

  const dropdownOptions = useMemo(
    () =>
      isDropdownOpen && (
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
      ),
    [isDropdownOpen, lang, handleLanguageChange],
  );

  const dropdownIcon = useMemo(
    () => (
      <svg
        className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Dropdown arrow</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    [isDropdownOpen],
  );
  return {
    lang,
    dropdownOptions,
    dropdownIcon,
    toggleDropdown,
  };
};

const LanguageDropdown = ({ lang }: { lang: Lang }) => {
  return <LanguageDropdownView {...useLanguageDropdown(lang)} />;
};

export default React.memo(LanguageDropdown);
