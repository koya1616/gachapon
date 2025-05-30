import Header from "@/app/[lang]/_components/Header";
import { CartProvider } from "@/context/CartContext";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../globals.css";
import Footer from "@/app/[lang]/_components/Footer";
import { LANGS } from "@/const/language";

export const metadata: Metadata = {
  title: "gachapon",
  description: "gachapon",
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) => {
  const { lang } = await params;
  if (!LANGS.includes(lang)) redirect("/ja");

  return (
    <html lang={lang}>
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Header lang={lang === "en" ? "en" : lang === "zh" ? "zh" : "ja"} />
          <main className="flex-grow">{children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
