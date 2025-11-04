import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Audiophile | Premium Audio Equipment",
  description: "Audiophile is an all in one stop to fulfill your audio needs. We're devoted to helping you get the most out of personal audio.",
  icons: {
    icon: '/assets/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-manrope antialiased">
        <ConvexClientProvider>
          <CartProvider>
            <Header />
            <CartModal />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}