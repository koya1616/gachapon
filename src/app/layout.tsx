import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "gachapon",
  description: "gachapon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="flex items-center justify-center sm:justify-start h-16 w-[90%] mx-auto my-4">
            <Image src="/logo.jpg" alt="Logo" width={56} height={56} className="rounded-full" />
            <div className="ml-2 text-xl font-semibold">gasyaponpon</div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
