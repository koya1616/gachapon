"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Cart from "@/components/Cart";
import LanguageDropdown from "@/components/LanguageDropdown";
import { useCart } from "@/context/CartContext";
import type { Lang } from "@/types";
import { usePathname, useRouter } from "next/navigation";

const AccountIcon = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className="icon icon-account w-4 h-4"
    fill="none"
    viewBox="0 0 18 19"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z"
      fill="currentColor"
    />
  </svg>
));

const CartIcon = React.memo(() => (
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
));

const Header = ({ lang }: { lang: Lang }) => {
  const router = useRouter();
  const path = usePathname();
  const showCart = !path.includes("/login") && !path.includes("/signup") && !path.includes("/account");
  const { cart, isCartOpen, totalPrice, toggleCart, closeCart, updateQuantity, removeFromCart, clear_cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = useCallback(() => {
    router.push(`/${lang}`);
  }, [router, lang]);

  const handleAccountClick = useCallback(() => {
    router.push(`/${lang}/account`);
  }, [router, lang]);

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between h-16 w-[90%] mx-auto mt-4 mb-2">
        <button type="button" className="cursor-pointer" onClick={handleLogoClick}>
          <div className="flex items-center">
            <Image
              src="https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/logo.jpg"
              alt="Logo"
              width={56}
              height={56}
              className="rounded-full w-10 h-10 sm:w-14 sm:h-14"
              priority
              loading="eager"
            />
            <div className="ml-2 text-base sm:text-xl font-semibold">gasyaponpon</div>
          </div>
        </button>

        <div className="py-4 flex justify-end items-center gap-2 sm:gap-4">
          <LanguageDropdown lang={lang} />
          <button type="button" className="cursor-pointer" onClick={handleAccountClick}>
            <div className="h-11 w-11 flex items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
              <AccountIcon />
            </div>
          </button>
          {showCart && (
            <button type="button" className="cursor-pointer" onClick={toggleCart}>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
                <CartIcon />
                {cartItemCount > 0 && (
                  <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                    {cartItemCount}
                  </div>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        cart={cart}
        totalPrice={totalPrice}
        onClose={closeCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clear_cart}
        lang={lang}
      />
    </header>
  );
};

export default React.memo(Header);
