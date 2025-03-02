import TanstackQueryProvider from "@/src/common/components/query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe",
  description: "Vibe: Social media application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster
          icons={{
            success: "✅",
            error: "❌",
            close: "✕",
            info: "ℹ️",
            loading: "⏳",
            warning: "⚠️",
          }}
          theme="dark"
          duration={3000}
          richColors
        />
      </body>
    </html>
  );
}
