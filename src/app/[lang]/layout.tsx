import type { Metadata } from "next";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { redirect } from "next/navigation";
import "../globals.css";
import { LANGS } from "@/const/language";

export const metadata: Metadata = {
  title: "gachapon",
  description: "gachapon",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!LANGS.includes(lang)) redirect("/ja");

  return (
    <html lang={lang}>
      <body>
        <CartProvider>
          <Header lang={lang === "en" ? "en" : "ja"} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
