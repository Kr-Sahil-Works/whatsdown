import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./client-providers";
import { Toaster } from "react-hot-toast";

/* =======================
   VIEWPORT (NO ZOOM)
======================= */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

/* =======================
   METADATA + PWA
======================= */
export const metadata: Metadata = {
  title: "WhatsPlus",
  description: "WhatsPlus chat app",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#0b141a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          overscroll-none
          touch-manipulation
        `}
      >
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
