import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny TypeScript Compiler",
  description:
    "A tiny TypeScript compiler to view the AST af a simple TypeScript function",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
