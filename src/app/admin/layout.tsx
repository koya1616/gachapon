"use client";

import "../globals.css";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import AdminHeaderView from "./_components/PageView";

export interface AdminHeaderLogic {
  pathname: string;
  isMenuOpen: boolean;
  navigationLinks: Array<{ name: string; path: string }>;
  toggleMenu: () => void;
  handleMobileNavClick: () => void;
}

const useAdminHeader = (): AdminHeaderLogic => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = useMemo(
    () => [
      { name: "ダッシュボード", path: "/admin/top" },
      { name: "商品一覧", path: "/admin/products" },
      { name: "抽選管理", path: "/admin/lotteries" },
      { name: "オークション", path: "/admin/auctions" },
      { name: "決済管理", path: "/admin/payment" },
      { name: "アップロード", path: "/admin/upload" },
    ],
    [],
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMobileNavClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return {
    pathname,
    isMenuOpen,
    navigationLinks,
    toggleMenu,
    handleMobileNavClick,
  };
};

const isLoginPage = (pathname: string) => {
  return pathname.includes("/admin/login");
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const showHeader = !isLoginPage(pathname);

  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {showHeader && <AdminHeaderView {...useAdminHeader()} />}
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
