import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TrustID — Sovereign Identity",
  description: "Prove who you are. Share nothing more.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-surface-950 text-slate-100 antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #14b8a630",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
