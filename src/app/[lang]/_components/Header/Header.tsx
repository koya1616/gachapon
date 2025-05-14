"use client";

import Cart from "@/app/[lang]/_components/Cart";
import LanguageDropdown from "@/app/[lang]/_components/LanguageDropdown";
import { AccountIcon, CartIcon } from "@/components/Icons";
import { useCart } from "@/context/CartContext";
import type { Lang, Product } from "@/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface HeaderLogic {
  lang: Lang;
  showCart: boolean;
  cartItemCount: number;
  isCartOpen: boolean;
  cart: Product[];
  totalPrice: number;
  toggleCart: () => void;
  closeCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clear_cart: () => void;
  handleLogoClick: () => void;
  handleAccountClick: () => void;
}

export const HeaderView = React.memo(
  ({
    lang,
    showCart,
    cartItemCount,
    isCartOpen,
    cart,
    totalPrice,
    toggleCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    clear_cart,
    handleLogoClick,
    handleAccountClick,
  }: HeaderLogic) => {
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
  },
);

const useHeader = (lang: Lang): HeaderLogic => {
  const router = useRouter();
  const path = usePathname();
  const showCart =
    !path.includes("/login") && !path.includes("/signup") && !path.includes("/account") && !path.includes("/top");
  const { cart, isCartOpen, totalPrice, toggleCart, closeCart, updateQuantity, removeFromCart, clear_cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = useCallback(() => {
    router.push(`/${lang}`);
  }, [router, lang]);

  const handleAccountClick = useCallback(() => {
    router.push(`/${lang}/account`);
  }, [router, lang]);

  return {
    lang,
    showCart,
    cartItemCount,
    isCartOpen,
    cart,
    totalPrice,
    toggleCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    clear_cart,
    handleLogoClick,
    handleAccountClick,
  };
};

const Header = ({ lang }: { lang: Lang }) => {
  return <HeaderView {...useHeader(lang)} />;
};

export default React.memo(Header);
