"use client";

import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const AdminHeader = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { name: "ダッシュボード", path: "/admin/top" },
    { name: "商品一覧", path: "/admin/products" },
    { name: "抽選管理", path: "/admin/lotteries" },
    { name: "決済管理", path: "/admin/payment" },
    { name: "アップロード", path: "/admin/upload" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/top" className="flex-shrink-0 flex items-center">
              <Image
                src="https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>

            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.path
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">メニューを開く</span>
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === link.path
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

const isLoginPage = (pathname: string) => {
  return pathname.includes("/admin/login");
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeader = !isLoginPage(pathname);

  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {showHeader && <AdminHeader />}
        <main>{children}</main>
      </body>
    </html>
  );
}
