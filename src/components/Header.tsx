"use client";

import Image from "next/image";
import Cart from "@/components/Cart";
import { useCart } from "@/context/CartContext";
import type { Lang } from "@/types";
import { LANGS } from "@/const/language";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  lang: Lang;
}

export default function Header({ lang }: HeaderProps) {
  const { cart, isCartOpen, totalPrice, toggleCart, closeCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLanguageChange = (newLang: Lang) => {
    setIsDropdownOpen(false);
    router.push(`/${newLang}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between h-16 w-[90%] mx-auto mt-4 mb-2">
        <div className="flex items-center">
          <Image
            src="https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/logo.jpg"
            alt="Logo"
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="ml-2 text-xl font-semibold">gasyaponpon</div>
        </div>
        <div className="py-4 flex justify-end items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center justify-between w-20 px-3 py-2 text-sm border border-neutral-200 rounded-md bg-white cursor-pointer"
            >
              {lang.toUpperCase()}
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
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-neutral-200 rounded-md shadow-lg z-10">
                {LANGS.map((langOption) => (
                  <button
                    type="button"
                    key={langOption}
                    onClick={() => handleLanguageChange(langOption as Lang)}
                    className={`w-full text-left px-3 py-2 text-sm cursor-pointer ${
                      lang === langOption ? "bg-blue-600 text-white" : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {langOption.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="cursor-pointer" onClick={toggleCart}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-4 transition-all ease-in-out hover:scale-110"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {cartItemCount > 0 && (
                <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                  {cartItemCount}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        cart={cart}
        totalPrice={totalPrice}
        onClose={closeCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        lang={lang}
      />
    </header>
  );
}
