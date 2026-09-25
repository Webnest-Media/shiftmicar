import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { RootShell } from "@/components/layout/root-shell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "block",
});

export const metadata: Metadata = {
  title: "Shift My Car | Reliable Car Shifting & Vehicle Transportation",
  description:
    "Shift My Car is your go-to destination for efficient and reliable car shifting services, along with top-notch packers and movers solutions.",
  icons: {
    icon: "/fav.svg",
    shortcut: "/fav.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <script src="/env.js" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
