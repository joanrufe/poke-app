import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ReactQueryProvider } from "@/lib/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokemon Explorer",
  description: "Explore and discover Pokemon with detailed information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="flex items-center justify-between px-6 py-3 border-b border-border mb-6">
              <h1 className="text-2xl font-bold">
                <Link href="/">Pokemon Explorer</Link>
              </h1>
              <ThemeToggle />
            </header>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
