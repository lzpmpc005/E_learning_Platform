import type { Metadata } from "next";
import { Footer } from "@/components/common";
import { Navbar } from "./(dashboard)/_components/navbar";
export const metadata: Metadata = {
  title: "collegeX | Learn Free, Learn Fast, Learn Everything!",
};

import "./globals.css";

import { Inter } from "next/font/google";
import Provider from "@/redux/provider";
import { Setup } from "@/components/utils";
import { ConfettiProvider } from "@/components/common/Confetti";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ConfettiProvider />
          <Setup />
          <div className="h-[70px] fixed inset-y-0 w-full z-50">
            <Navbar />
          </div>
          <main className="pt-[60px] pb-[30px] flex-grow">{children}</main>
          <div className="h-[30px] fixed bottom-7 w-full z-50">
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
