import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/providers/i18n-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dấu Chân Việt - Monopoly Experience Hub",
  description: "Trải nghiệm dấu chân Việt hấp dẫn tại Đà Nẵng. Giải đố thú vị, đội ngũ thân thiện, giá cả hợp lý.",
  icons: {
    icon: "/images/header/Logo.png",
    shortcut: "/images/header/Logo.png",
    apple: "/images/header/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}