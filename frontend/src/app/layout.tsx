import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gestão de moldes e cavidades",
  description: "Sistema de Gestão de Moldes e cavidades Proinject",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={roboto.className}>
      <body >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
